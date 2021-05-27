import BmdChemicalPca from './BmdChemicalPca';

class BmdAssayPca extends BmdChemicalPca {
    _getUrl(bmdType) {
        return `/neurotox/api/${bmdType}/pca_assay/?format=json`;
    }
}

export default BmdAssayPca;
