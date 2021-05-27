from django.db import models
from django.db.models import F, Q
from django.contrib.postgres.fields import ArrayField
import matplotlib as mpl
import numpy as np
import pandas as pd
import plotly.graph_objs as go
import seaborn as sns
from sklearn import decomposition
from sklearn.preprocessing import Imputer



class Assay(models.Model):
    protocol = models.CharField(primary_key=True, max_length=64)
    name = models.CharField(max_length=128)
    provider = models.CharField(max_length=32)

    def __str__(self):
        return self.protocol

    @staticmethod
    def  get_metadata():
        # returns metadata for both Chemical and Readout; used
        return {
            "readouts": Readout.get_flat().to_dict(orient="records"),
            "substances": Substance.get_flat().to_dict(orient="records"),
        }


class Plate(models.Model):
    protocol = models.ForeignKey(Assay, related_name="plates")
    name = models.CharField(max_length=64)
    size = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (("protocol", "name"),)

    def get_grid(self):
        qs = (
            WellResponse.objects.filter(well__plate=self)
            .select_related("well", "well__plate")
            .values(
                "well__row_index",
                "well__column_index",
                "well__substance__chemical__casrn",
                "well__substance__chemical__name",
                "well__substance__chemical__category_id",
                "well__vehicle_control",
                "well__positive_control",
                "well__concentration",
                "well__chemical_ship_position",
                "readout__endpoint",
                "readout__is_viability",
                "id",
                "response_raw",
                "response_normalized",
                "is_outlier",
            )
        )
        return pd.DataFrame(list(qs))


class Readout(models.Model):

    DIRECTIONALITY_CHOICES = (
        (-1, "Negative only"),
        (0, "Negative and positive"),
        (1, "Positive only"),
        (999, "No direction"),
    )

    protocol = models.ForeignKey(Assay, related_name="readouts")
    endpoint = models.CharField(max_length=64)
    category = models.CharField(max_length=32)
    is_viability = models.BooleanField(default=False)
    calculate_bmc = models.BooleanField(default=False)
    directionality = models.SmallIntegerField(default=0, choices=DIRECTIONALITY_CHOICES)

    class Meta:
        unique_together = (("protocol", "endpoint"),)

    def __str__(self):
        return self.endpoint

    @classmethod
    def get_flat(cls):
        cols = (
            "protocol__protocol",
            "protocol__name",
            "protocol__provider",
            "id",
            "endpoint",
            "category",
            "is_viability",
            "calculate_bmc",
            "directionality",
        )
        qs = cls.objects.select_related("assay").values_list(*cols)
        return pd.DataFrame(list(qs), columns=cols)

    def get_responses(self, casrn=None):
        filters = Q(readout=self)
        if casrn:
            filters &= Q(well__substance__chemical=casrn)
        qs = (
            WellResponse.objects.filter(filters)
            .select_related("well", "well__substance", "well__substance__chemical")
            .values(
                "well__concentration",
                "well__chemical_ship_position",
                "well__substance",
                "well__vehicle_control",
                "well__substance__chemical__casrn",
                "well__substance__chemical__name",
                "well__substance__chemical__category_id",
                "well__plate_id",
                "id",
                "response_raw",
                "response_normalized",
                "is_outlier",
            )
        )
        return pd.DataFrame(list(qs))

    @classmethod
    def vehicle_controls(cls):
        columns = (
            "readout_id",
            "well__plate_id",
            "response_raw",
            "response_normalized",
            "is_outlier",
        )
        qs = (
            WellResponse.objects.select_related("well")
            .filter(well__vehicle_control=True)
            .values_list(*columns)
        )
        return pd.DataFrame(data=list(qs), columns=columns)


class Category(models.Model):
    name = models.CharField(max_length=32, primary_key=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Chemical(models.Model):
    casrn = models.CharField(primary_key=True, max_length=16)
    name = models.CharField(max_length=128)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    ntp80 = models.BooleanField(default=False)
    ntp91 = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def get_responses(self, readout=None):
        filters = Q(well__substance__chemical=self)
        if readout:
            filters &= Q(readout=readout)
        qs = (
            WellResponse.objects.filter(filters)
            .select_related("well", "well__substance", "readout")
            .values(
                "well__concentration",
                "well__chemical_ship_position",
                "well__substance",
                "well__substance__lot",
                "id",
                "response_raw",
                "response_normalized",
                "is_outlier",
                "readout__id",
                "readout__protocol_id",
                "readout__endpoint",
                "readout__category",
                "readout__is_viability",
                "readout__calculate_bmc",
                "readout__directionality",
            )
        )
        return pd.DataFrame(list(qs))


class Substance(models.Model):
    lot = models.CharField(max_length=16, blank=True)
    chemical = models.ForeignKey(Chemical)

    class Meta:
        unique_together = (("lot", "chemical"),)

    def __str__(self):
        return f"{self.id}-{self.chemical.name}"

    @classmethod
    def get_flat(cls):
        qs = cls.objects.select_related("chemical").values(
            "id",
            "lot",
            "chemical__casrn",
            "chemical__name",
            "chemical__category_id",
            "chemical__ntp80",
            "chemical__ntp91",
        )
        return pd.DataFrame(list(qs))


class Well(models.Model):
    """
    A well is a location with a chemical concentration where multiple readouts
    may be measured. Traditionally, it is a well on a plate. However, some
    assays may not have a plate, so the row_index and column_index may be null
    in some cases.
    """

    plate = models.ForeignKey(Plate, related_name="wells")
    row_index = models.PositiveSmallIntegerField(null=True)
    column_index = models.PositiveSmallIntegerField(null=True)
    substance = models.ForeignKey(Substance, related_name="wells")
    vehicle_control = models.BooleanField(default=False)
    positive_control = models.BooleanField(default=False)
    concentration = models.FloatField()
    chemical_ship_position = models.CharField(max_length=4, blank=True)


class WellResponse(models.Model):
    well = models.ForeignKey(Well)
    readout = models.ForeignKey(Readout)
    response_raw = models.FloatField(null=True)
    response_normalized = models.FloatField(null=True)
    is_outlier = models.BooleanField(default=False)

    class Meta:
        unique_together = (("well", "readout"),)

    @classmethod
    def dose_responses(cls, readout_ids, chemical_ids):
        # return a list of dose-response data
        dr = (
            cls.objects.filter(
                readout__in=readout_ids, well__substance__chemical__in=chemical_ids
            )
            .select_related("readout", "substance", "substance__chemical")
            .values(
                "readout_id",
                endpoint_name=F("readout__endpoint"),
                chemical_name=F("well__substance__chemical__name"),
                casrn=F("well__substance__chemical_id"),
                conc=F("well__concentration"),
                normalized_response=F("response_normalized"),
            )
        )

        hill = (
            Hill.objects.filter(
                readout__in=readout_ids, substance__chemical__in=chemical_ids
            )
            .annotate(casrn=F("substance__chemical_id"))
            .values()
        )

        curvep = (
            CurveP.objects.filter(
                readout__in=readout_ids, substance__chemical__in=chemical_ids
            )
            .annotate(casrn=F("substance__chemical_id"))
            .values()
        )

        return dict(dose_response=list(dr), hill=list(hill), curvep=list(curvep))

    @classmethod
    def substances_by_readout(cls):
        qs = (
            cls.objects.select_related(
                "readout", "well", "well__substance", "well__substance__chemical"
            )
            .values(
                "well__substance",
                "well__substance__chemical__name",
                "well__substance__chemical__casrn",
                "well__substance__chemical__category_id",
                "readout__id",
                "readout__protocol_id",
                "readout__endpoint",
                "readout__category",
                "readout__is_viability",
                "readout__calculate_bmc",
                "readout__directionality",
            )
            .distinct("well__substance", "readout__id")
        )
        return pd.DataFrame(list(qs))


class BmdMixin:
    """
    Shared methods for Hill and CurveP
    """

    CATEGORY_COLORS = {
        "Drug": "#3182bd",
        "Drug*": "#9ecae1",
        "Flame Retardant": "#e7ba52",
        "Industrial": "#31a354",
        "Industrial*": "#a1d99b",
        "Assay specific control": "#ee7621",
        "Negative": "#636363",
        "PAH": "#756bb1",
        "Pesticide": "#ad494a",
        "Pesticide*": "#d6616b",
    }

    @classmethod
    def get_bmds(cls, casrns=None, readout_ids=None):

        filters = Q()

        if casrns:
            filters &= Q(substance__chemical__in=casrns)

        if readout_ids:
            filters &= Q(readout_id__in=readout_ids)

        qs = (
            cls.objects.filter(filters)
            .select_related(
                "readout", "readout__protocol", "substance", "substance__chemical"
            )
            .values_list(
                "id",
                "bmd",
                "bmdl",
                "bmdu",
                "is_active",
                "selectivity_ratio",
                "has_viability_bmd",
                "substance_id",
                "substance__chemical__name",
                "substance__chemical__casrn",
                "substance__chemical__category_id",
                "readout__protocol_id",
                "readout__protocol__provider",
                "readout__id",
                "readout__endpoint",
                "readout__category",
                "readout__is_viability",
                "readout__calculate_bmc",
                "readout__directionality",
            )
        )

        names = (
            "id",
            "bmd",
            "bmdl",
            "bmdu",
            "is_active",
            "selectivity_ratio",
            "has_viability_bmd",
            "substance_id",
            "chemical_name",
            "chemical_casrn",
            "chemical_category",
            "protocol",
            "protocol_provider",
            "readout_id",
            "readout_endpoint",
            "readout_category",
            "readout_is_viability",
            "readout_calculate_bmc",
            "readout_directionality",
        )

        return pd.DataFrame(columns=names, data=list(qs))

    @staticmethod
    def _pca_build_plot(df, labels, color_name, hover_txt_str):
        data = []
        for c in df.color.unique():
            df2 = df.query(f'color=="{c}"')
            trace = go.Scatter3d(
                name=df2[color_name].tolist()[0],
                x=df2.x,
                y=df2.y,
                z=df2.z,
                mode="markers",
                text=df2[hover_txt_str],
                marker=dict(size=12, color=df2.color, line=dict(width=1), opacity=0.8),
            )
            data.append(trace)

        layout = go.Layout(
            title=labels["title"],
            margin=dict(l=0, r=0, b=100, t=100),
            scene=dict(
                aspectmode="cube",
                xaxis=dict(title=labels["xlbl"], showticklabels=False),
                yaxis=dict(title=labels["ylbl"], showticklabels=False),
                zaxis=dict(title=labels["zlbl"], showticklabels=False),
            ),
            height=700,
        )

        return go.Figure(data=data, layout=layout)

    @classmethod
    def get_pca_df(cls):
        raise NotImplementedError()

    @classmethod
    def pca_assay(cls):
        def _calc_pca():
            # get data
            df = cls.get_pca_df()

            # pivot data
            df2 = df.pivot(index="readout_id", columns="casrn", values="value")

            # drop missing data and impute missing
            df2 = df2.dropna(axis=1, how="all")
            tmp = Imputer(missing_values=np.nan, strategy="mean", axis=0)
            df3 = pd.DataFrame(tmp.fit_transform(df2))
            df3.columns = df2.columns
            df3.index = df2.index

            # pca
            pca = decomposition.PCA(n_components=3)
            pca.fit(df3)
            X = pca.transform(df3)
            y = np.array(df.readout_id.unique(), dtype=np.float64)
            variances = pca.explained_variance_ratio_

            # pca data
            df4 = pd.DataFrame(
                np.vstack([y, X.T]).T, columns=["readout", "x", "y", "z"]
            )

            # pca labels
            labels = dict(
                xlbl="PCA #1 ({:.1%})".format(variances[0]),
                ylbl="PCA #2 ({:.1%})".format(variances[1]),
                zlbl="PCA #3 ({:.1%})".format(variances[2]),
                title="PCA across all chemicals, one per-readout ({:.1%})".format(
                    variances.sum()
                ),
            )
            df4['readout'] = df4.readout.astype(int)
            return df4, labels

        def _pca_add_metadata(df):
            # add readout name
            cw = {k: v for k, v in Readout.objects.values_list("id", "endpoint")}
            df["readout_str"] = df.apply(lambda r: cw[r.readout], axis=1)

            # add color
            dfc = pd.DataFrame(list(Readout.objects.values("id", "protocol")))
            colors = sns.color_palette("Paired", n_colors=dfc.protocol.unique().size).as_hex()
            if len(colors) != len(set(colors)):
                # ensure all colors are unique (small palettes will repeat)
                raise ValueError('Repeating colors in color-pallette')
            cw2 = {k: v for k, v in zip(sorted(dfc.protocol.unique()), colors)}
            dfc["color"] = dfc.apply(lambda r: cw2[r.protocol], axis=1)

            # add color and assay protocol name
            df = df.merge(dfc, left_on="readout", right_on="id").sort_values('protocol')

            return df

        df, labels = _calc_pca()
        df = _pca_add_metadata(df)
        return cls._pca_build_plot(df, labels, "protocol", "readout_str")

    @classmethod
    def pca_chemical(cls):
        def _calc_pca():
            # get data
            df = cls.get_pca_df()

            # pivot data
            df2 = df.pivot(index="casrn", columns="readout_id", values="value")

            # drop missing data and impute missing
            df2 = df2.dropna(axis=0, how="all")
            df2 = df2.dropna(axis=1, how="all")
            tmp = Imputer(missing_values=np.nan, strategy="mean", axis=1)
            df3 = pd.DataFrame(tmp.fit_transform(df2))
            df3.columns = df2.columns
            df3.index = df2.index

            # pca
            pca = decomposition.PCA(n_components=3)
            pca.fit(df3)
            X = pca.transform(df3)
            y = df3.index.tolist()
            variances = pca.explained_variance_ratio_

            # pca data
            df4 = pd.DataFrame(np.vstack([y, X.T]).T, columns=["casrn", "x", "y", "z"])

            # pca labels
            labels = dict(
                xlbl="PCA #1 ({:.1%})".format(variances[0]),
                ylbl="PCA #2 ({:.1%})".format(variances[1]),
                zlbl="PCA #3 ({:.1%})".format(variances[2]),
                title="PCA across all readouts, one per chemical ({:.1%})".format(
                    variances.sum()
                ),
            )

            return df4, labels

        def _pca_add_metadata(df):
            # add readout name
            cw = {k: v for k, v in Chemical.objects.values_list("casrn", "name")}
            df["chem_name"] = df.apply(lambda d: cw[d.casrn], axis=1)

            # add color
            dfc = pd.DataFrame(list(Chemical.objects.values("casrn", "category")))
            cw2 = {k: BmdMixin.CATEGORY_COLORS[k] for k in dfc.category.unique()}
            dfc["color"] = dfc.apply(lambda r: cw2[r.category], axis=1)

            # add color and assay protocol name
            df = df.merge(dfc, how="left", on="casrn")
            df.sort_values("category", inplace=True)

            return df

        df, labels = _calc_pca()
        df = _pca_add_metadata(df)
        return cls._pca_build_plot(df, labels, "category", "chem_name")
class ExposureBmdMixin:
    """
    Shared methods for ExposureHill and exposureCurveP
    """

    CATEGORY_COLORS = {
        "Drug": "#3182bd",
        "Drug*": "#9ecae1",
        "Flame Retardant": "#e7ba52",
        "Industrial": "#31a354",
        "Industrial*": "#a1d99b",
        "Assay specific control": "#ee7621",
        "Negative": "#636363",
        "PAH": "#756bb1",
        "Pesticide": "#ad494a",
        "Pesticide*": "#d6616b",
    }

    @classmethod
    def get_bmds(cls, casrns=None, readout_ids=None):

        filters = Q()

        if casrns:
            filters &= Q(substance__chemical__in=casrns)

        if readout_ids:
            filters &= Q(readout_id__in=readout_ids)

        qs = (
            cls.objects.filter(filters)
            .select_related(
                "readout", "readout__protocol", "substance", "substance__chemical"
            )
            .values_list(
                "id",
                "bmd",
                "bmdl",
                "bmdu",
                "seem3_cmean",
                "seem3_l95",
                "seem3_u95",
                "is_active",
                "selectivity_ratio",
                "has_viability_bmd",
                "substance_id",
                "substance__chemical__name",
                "substance__chemical__casrn",
                "substance__chemical__category_id",
                "readout__protocol_id",
                "readout__protocol__provider",
                "readout__id",
                "readout__endpoint",
                "readout__category",
                "readout__is_viability",
                "readout__calculate_bmc",
                "readout__directionality",

            )
        )

        names = (
            "id",
            "bmd",
            "bmdl",
            "bmdu",
            "seem3_cmean",
            "seem3_l95",
            "seem3_u95",
            "is_active",
            "selectivity_ratio",
            "has_viability_bmd",
            "substance_id",
            "chemical_name",
            "chemical_casrn",
            "chemical_category",
            "protocol",
            "protocol_provider",
            "readout_id",
            "readout_endpoint",
            "readout_category",
            "readout_is_viability",
            "readout_calculate_bmc",
            "readout_directionality",

        )

        return pd.DataFrame(columns=names, data=list(qs))

    @staticmethod
    def _pca_build_plot(df, labels, color_name, hover_txt_str):
        data = []
        for c in df.color.unique():
            df2 = df.query(f'color=="{c}"')
            trace = go.Scatter3d(
                name=df2[color_name].tolist()[0],
                x=df2.x,
                y=df2.y,
                z=df2.z,
                mode="markers",
                text=df2[hover_txt_str],
                marker=dict(size=12, color=df2.color, line=dict(width=1), opacity=0.8),
            )
            data.append(trace)

        layout = go.Layout(
            title=labels["title"],
            margin=dict(l=0, r=0, b=100, t=100),
            scene=dict(
                aspectmode="cube",
                xaxis=dict(title=labels["xlbl"], showticklabels=False),
                yaxis=dict(title=labels["ylbl"], showticklabels=False),
                zaxis=dict(title=labels["zlbl"], showticklabels=False),
            ),
            height=700,
        )

        return go.Figure(data=data, layout=layout)

    @classmethod
    def get_pca_df(cls):
        raise NotImplementedError()

    @classmethod
    def pca_assay(cls):
        def _calc_pca():
            # get data
            df = cls.get_pca_df()

            # pivot data
            df2 = df.pivot(index="readout_id", columns="casrn", values="value")

            # drop missing data and impute missing
            df2 = df2.dropna(axis=1, how="all")
            tmp = Imputer(missing_values=np.nan, strategy="mean", axis=0)
            df3 = pd.DataFrame(tmp.fit_transform(df2))
            df3.columns = df2.columns
            df3.index = df2.index

            # pca
            pca = decomposition.PCA(n_components=3)
            pca.fit(df3)
            X = pca.transform(df3)
            y = np.array(df.readout_id.unique(), dtype=np.float64)
            variances = pca.explained_variance_ratio_

            # pca data
            df4 = pd.DataFrame(
                np.vstack([y, X.T]).T, columns=["readout", "x", "y", "z"]
            )

            # pca labels
            labels = dict(
                xlbl="PCA #1 ({:.1%})".format(variances[0]),
                ylbl="PCA #2 ({:.1%})".format(variances[1]),
                zlbl="PCA #3 ({:.1%})".format(variances[2]),
                title="PCA across all chemicals, one per-readout ({:.1%})".format(
                    variances.sum()
                ),
            )
            df4['readout'] = df4.readout.astype(int)
            return df4, labels

        def _pca_add_metadata(df):
            # add readout name
            cw = {k: v for k, v in Readout.objects.values_list("id", "endpoint")}
            df["readout_str"] = df.apply(lambda r: cw[r.readout], axis=1)

            # add color
            dfc = pd.DataFrame(list(Readout.objects.values("id", "protocol")))
            colors = sns.color_palette("Paired", n_colors=dfc.protocol.unique().size).as_hex()
            if len(colors) != len(set(colors)):
                # ensure all colors are unique (small palettes will repeat)
                raise ValueError('Repeating colors in color-pallette')
            cw2 = {k: v for k, v in zip(sorted(dfc.protocol.unique()), colors)}
            dfc["color"] = dfc.apply(lambda r: cw2[r.protocol], axis=1)

            # add color and assay protocol name
            df = df.merge(dfc, left_on="readout", right_on="id").sort_values('protocol')

            return df

        df, labels = _calc_pca()
        df = _pca_add_metadata(df)
        return cls._pca_build_plot(df, labels, "protocol", "readout_str")

    @classmethod
    def pca_chemical(cls):
        def _calc_pca():
            # get data
            df = cls.get_pca_df()

            # pivot data
            df2 = df.pivot(index="casrn", columns="readout_id", values="value")

            # drop missing data and impute missing
            df2 = df2.dropna(axis=0, how="all")
            df2 = df2.dropna(axis=1, how="all")
            tmp = Imputer(missing_values=np.nan, strategy="mean", axis=1)
            df3 = pd.DataFrame(tmp.fit_transform(df2))
            df3.columns = df2.columns
            df3.index = df2.index

            # pca
            pca = decomposition.PCA(n_components=3)
            pca.fit(df3)
            X = pca.transform(df3)
            y = df3.index.tolist()
            variances = pca.explained_variance_ratio_

            # pca data
            df4 = pd.DataFrame(np.vstack([y, X.T]).T, columns=["casrn", "x", "y", "z"])

            # pca labels
            labels = dict(
                xlbl="PCA #1 ({:.1%})".format(variances[0]),
                ylbl="PCA #2 ({:.1%})".format(variances[1]),
                zlbl="PCA #3 ({:.1%})".format(variances[2]),
                title="PCA across all readouts, one per chemical ({:.1%})".format(
                    variances.sum()
                ),
            )

            return df4, labels

        def _pca_add_metadata(df):
            # add readout name
            cw = {k: v for k, v in Chemical.objects.values_list("casrn", "name")}
            df["chem_name"] = df.apply(lambda d: cw[d.casrn], axis=1)

            # add color
            dfc = pd.DataFrame(list(Chemical.objects.values("casrn", "category")))
            cw2 = {k: BmdMixin.CATEGORY_COLORS[k] for k in dfc.category.unique()}
            dfc["color"] = dfc.apply(lambda r: cw2[r.category], axis=1)

            # add color and assay protocol name
            df = df.merge(dfc, how="left", on="casrn")
            df.sort_values("category", inplace=True)

            return df

        df, labels = _calc_pca()
        df = _pca_add_metadata(df)
        return cls._pca_build_plot(df, labels, "category", "chem_name")


class Hill(BmdMixin, models.Model):
    substance = models.ForeignKey(Substance, on_delete=models.CASCADE)
    readout = models.ForeignKey(Readout, on_delete=models.CASCADE)
    is_increasing = models.BooleanField()
    is_active = models.BooleanField(default=False)
    bmd = models.FloatField(verbose_name="BMD", null=True)
    bmr = models.FloatField(verbose_name="BMR", null=True)
    bmdl = models.FloatField(verbose_name="BMDL", null=True)
    bmdu = models.FloatField(verbose_name="BMDU", null=True)
    param_vmax = models.FloatField(verbose_name="Vmax", null=True)
    param_k = models.FloatField(verbose_name="K", null=True)
    param_n = models.FloatField(verbose_name="N", null=True)
    selectivity_ratio = models.FloatField(null=True)
    has_viability_bmd = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Hill curve BMD"
        verbose_name_plural = "Hill curve BMDs"

    @classmethod
    def get_flat(cls, casrns=None, readout_ids=None):

        filters = Q()

        if casrns:
            filters &= Q(substance__chemical__in=casrns)

        if readout_ids:
            filters &= Q(readout_id__in=readout_ids)

        qs = (
            cls.objects.filter(filters)
            .select_related("readout", "substance", "substance__chemical")
            .values_list(
                "id",
                "is_increasing",
                "hit",
                "bmd",
                "bmdl",
                "param_vmax",
                "param_k",
                "param_n",
                "substance_id",
                "substance__chemical__name",
                "substance__chemical__casrn",
                "substance__chemical__category_id",
                "readout__protocol_id",
                "readout__id",
                "readout__endpoint",
                "readout__category",
                "readout__is_viability",
                "readout__calculate_bmc",
                "readout__directionality",
            )
        )

        names = (
            "id",
            "is_increasing",
            "hit",
            "bmd",
            "bmdl",
            "param_vmax",
            "param_k",
            "param_n",
            "substance_id",
            "chemical_name",
            "chemical_casrn",
            "chemical_category",
            "protocol",
            "readout__id",
            "readout_endpoint",
            "readout_category",
            "readout_is_viability",
            "readout_calculate_bmc",
            "readout_directionality",
        )

        return pd.DataFrame(columns=names, data=list(qs))

    @classmethod
    def get_pca_df(cls):
        qs = cls.objects.filter(bmd__isnull=False).values(
            "readout_id",
            readout_str=F("readout__endpoint"),
            casrn=F("substance__chemical__casrn"),
            raw=F("bmd"),
        )
        df = pd.DataFrame(list(qs))
        # log10(bmc/1e-6)
        df["value"] = np.log10(df.raw / 1e-6)
        return df


class CurveP(BmdMixin, models.Model):
    substance = models.ForeignKey(Substance, on_delete=models.CASCADE)
    readout = models.ForeignKey(Readout, on_delete=models.CASCADE)
    is_increasing = models.BooleanField()
    is_active = models.BooleanField(default=False)
    bmd = models.FloatField(null=True)
    bmdl = models.FloatField(verbose_name="BMDL", null=True)
    bmdu = models.FloatField(verbose_name="BMDU", null=True)
    bmr = models.FloatField(verbose_name="BMR", null=True)
    wauc = models.FloatField(null=True)
    emax = models.FloatField(null=True)
    doses = ArrayField(models.FloatField())
    responses = ArrayField(models.FloatField())
    comments = models.CharField(max_length=128)
    selectivity_ratio = models.FloatField(null=True)
    has_viability_bmd = models.BooleanField(default=False)

    class Meta:
        verbose_name = "CurveP BMD"
        verbose_name_plural = "CurveP BMDs"

    @classmethod
    def get_pca_df(cls):
        qs = cls.objects.filter(wauc__isnull=False).values(
            "readout_id",
            readout_str=F("readout__endpoint"),
            casrn=F("substance__chemical__casrn"),
            raw=F("wauc"),
        )
        df = pd.DataFrame(list(qs))
        # sign * log10(abs(wauc) + 1)
        df["value"] = np.sign(df.raw) * np.log10(np.abs(df.raw) + 1)
        df2 = df.groupby(["casrn", "readout_id"])
        df2 = pd.DataFrame(
            dict(readout_str=df2.readout_str.first(), value=df2.value.mean())
        ).reset_index()
        return df2


# exposure data
class Exposure(models.Model):
    casrn = models.CharField(primary_key=True, max_length=32)
    seem3_cmean = models.FloatField(null=True)
    seem3_l95 = models.FloatField(null=True)
    seem3_u95 = models.FloatField(null=True)


    class Meta:
        unique_together = (("casrn", "seem3_cmean"),)

        # verbose_name = "Exposure BMD"
        # verbose_name_plural = "Exposure BMDs"

    def __str__(self):
        return self.casrn

    @classmethod
    def get_pca_df(cls):
        qs = cls.objects.filter(wauc__isnull=False).values(
            "readout_id",
            readout_str=F("readout__endpoint"),
            casrn=F("substance__chemical__casrn"),
            raw=F("wauc"),
        )
        df = pd.DataFrame(list(qs))
        # sign * log10(abs(wauc) + 1)
        df["value"] = np.sign(df.raw) * np.log10(np.abs(df.raw) + 1)
        df2 = df.groupby(["casrn", "readout_id"])
        df2 = pd.DataFrame(
            dict(readout_str=df2.readout_str.first(), value=df2.value.mean())
        ).reset_index()
        return df2

# exposure data
# backup: ExposureBmdMixin
class expo_hill(ExposureBmdMixin, models.Model):
    substance = models.ForeignKey(Substance, on_delete=models.CASCADE)
    readout = models.ForeignKey(Readout, on_delete=models.CASCADE)
    is_increasing = models.BooleanField()
    is_active = models.BooleanField(default=False)
    bmd = models.FloatField(verbose_name="BMD", null=True)
    bmr = models.FloatField(verbose_name="BMR", null=True)
    bmdl = models.FloatField(verbose_name="BMDL", null=True)
    bmdu = models.FloatField(verbose_name="BMDU", null=True)
    param_vmax = models.FloatField(verbose_name="Vmax", null=True)
    param_k = models.FloatField(verbose_name="K", null=True)
    param_n = models.FloatField(verbose_name="N", null=True)
    selectivity_ratio = models.FloatField(null=True)
    has_viability_bmd = models.BooleanField(default=False)

    # casrn = models.CharField(primary_key=True, max_length=32)
    seem3_cmean = models.FloatField(null=True)
    seem3_l95 = models.FloatField(null=True)
    seem3_u95 = models.FloatField(null=True)


    class Meta:
        verbose_name = "Hill curve BMD"
        verbose_name_plural = "Hill curve BMDs"

    @classmethod
    def get_flat(cls, casrns=None, readout_ids=None):

        filters = Q()

        if casrns:
            filters &= Q(substance__chemical__in=casrns)

        if readout_ids:
            filters &= Q(readout_id__in=readout_ids)

        qs = (
            cls.objects.filter(filters)
            .select_related("readout", "substance", "substance__chemical")
            .values_list(
                "id",
                "is_increasing",
                "hit",
                "bmd",
                "bmdl",
                "seem3_cmean",
                "seem3_l95",
                "seem3_u95",
                "param_vmax",
                "param_k",
                "param_n",
                "substance_id",
                "substance__chemical__name",
                "substance__chemical__casrn",
                "substance__chemical__category_id",
                "readout__protocol_id",
                "readout__id",
                "readout__endpoint",
                "readout__category",
                "readout__is_viability",
                "readout__calculate_bmc",
                "readout__directionality",
            )
        )

        names = (
            "id",
            "is_increasing",
            "hit",
            "bmd",
            "bmdl",
            "seem3_cmean",
            "seem3_l95",
            "seem3_u95",
            "param_vmax",
            "param_k",
            "param_n",
            "substance_id",
            "chemical_name",
            "chemical_casrn",
            "chemical_category",
            "protocol",
            "readout__id",
            "readout_endpoint",
            "readout_category",
            "readout_is_viability",
            "readout_calculate_bmc",
            "readout_directionality",
        )

        return pd.DataFrame(columns=names, data=list(qs))



# exposure data
class expo_curvep(ExposureBmdMixin, models.Model):
    substance = models.ForeignKey(Substance, on_delete=models.CASCADE)
    readout = models.ForeignKey(Readout, on_delete=models.CASCADE)
    is_increasing = models.BooleanField()
    is_active = models.BooleanField(default=False)
    bmd = models.FloatField(null=True)
    bmdl = models.FloatField(verbose_name="BMDL", null=True)
    bmdu = models.FloatField(verbose_name="BMDU", null=True)
    bmr = models.FloatField(verbose_name="BMR", null=True)
    wauc = models.FloatField(null=True)
    emax = models.FloatField(null=True)
    doses = ArrayField(models.FloatField())
    responses = ArrayField(models.FloatField())
    comments = models.CharField(max_length=128)
    selectivity_ratio = models.FloatField(null=True)
    has_viability_bmd = models.BooleanField(default=False)

    # casrn = models.CharField(primary_key=True, max_length=32)
    seem3_cmean = models.FloatField(null=True)
    seem3_l95 = models.FloatField(null=True)
    seem3_u95 = models.FloatField(null=True)


    class Meta:
        verbose_name = "CurveP BMD"
        verbose_name_plural = "CurveP BMDs"

    @classmethod
    def get_pca_df(cls):
        qs = cls.objects.filter(wauc__isnull=False).values(
            "readout_id",
            readout_str=F("readout__endpoint"),
            casrn=F("substance__chemical__casrn"),
            raw=F("wauc"),
        )
        df = pd.DataFrame(list(qs))
        # sign * log10(abs(wauc) + 1)
        df["value"] = np.sign(df.raw) * np.log10(np.abs(df.raw) + 1)
        df2 = df.groupby(["casrn", "readout_id"])
        df2 = pd.DataFrame(
            dict(readout_str=df2.readout_str.first(), value=df2.value.mean())
        ).reset_index()
        return df2

