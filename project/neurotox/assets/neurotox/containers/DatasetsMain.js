import _ from 'lodash';
import React from 'react';

import HelpButtonWidget from '../widgets/HelpButtonWidget';

let renderCollins = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Eva-Maria Collins, University of California, San Diego</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>Dugesia japonica (freshwater planarian)</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>Full worm, regenerating worm (tail-only)</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>48-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>7, 12 days</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>~0.01-100 μM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>
                                    Mortality: percent morality (days 7 and 12) in full and
                                    regenerating worms
                                </li>
                                <li>
                                    Development: percent regenerating worms effected in eye
                                    regeneration assay (day 7)
                                </li>
                                <li>
                                    Behavior: percent scrunching in full and regenerating worms (day
                                    12); thermotaxis with heat in full and regenerating worms (day
                                    12)
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    Eye Regeneration: normal (2 eyes) or abnormal (0, 1, or > 2
                                    eyes) in regenerating/partial animals
                                </li>
                                <li>
                                    Thermotaxis: amount of time worm spent in the cold area divided
                                    by the amount of time spent in the entire well
                                </li>
                                <li>
                                    Scrunching: measurement of reaction to noxious heat stimulus and
                                    neuromuscular communication. Endpoint recorded as presence or
                                    absence of normal scrunching behavior
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderLein = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Pam Lein, University of California, Davis</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>Zebrafish 5D Tropical</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>Dechorionated zebrafish embryos</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>96-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>1, 2, 3, 4, 5 days post fertilization (dpf)</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td> 0.3, 1, 3, 10, 30 µM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>Mortality: percent mortality (days 1, 2, 3, 4, 5)</li>
                                <li>Development: percent embryos affected (days 1, 2, 3, 4, 5)</li>
                                <li>
                                    Behavior: total distance moved and larval movement pattern (days
                                    4 and 5)
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    Development: halted development, craniofacial, yolk sac edema,
                                    pericardial edema, red heart, body axis, notochord and caudal
                                    fin malformations
                                </li>
                                <li>
                                    Behavior: total distance moved - measured on the DanioVision
                                    behavior system (Noldus) performing a 35 minutes light/dark
                                    behavior test: 10 minute light period to allow for acclimation
                                    (5 min) and record baseline swimming (L1, 5 min), a 5 minute
                                    dark period (D1), a 5 minute light period (L2), and finally a 15
                                    minute dark period (D2). Larval behavior is recorded using the
                                    camera included in the DanioVision system, with an infrared
                                    filter to allow recording in both light and dark conditions.
                                    Total movement is tracked using the EthoVisionXT software
                                    (Noldus). Larval movement pattern - the movement pattern is
                                    defined as a sequence of total distance moved recorded per min
                                    across L1 to D2. Three metrics are used to quantify the
                                    similarity between a pair of embryos: Pearson’s r, Spearman’s
                                    rho, and cosine similarity. For further details on these metrics
                                    please see
                                    <a href="https://doi.org/10.1093/toxsci/kfy258">
                                        {' '}
                                        Hsieh et al., 2018
                                    </a>
                                    .
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderTanguay = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Robert Tanguay, Oregon State University</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>Zebrafish 5D Tropical</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>Dechorionated zebrafish embryos</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>96-well </td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>1, 5 days post fertilization (dpf)</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>1, 2, 4.5, 9, 18, 34, 67 µM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>Mortality: percent mortality (days 1 and 5)</li>
                                <li>Development: percent embryos affected (days 1 and 5)</li>
                                <li>
                                    Behavior: total distance moved and embryo/larval movement
                                    pattern (days 1 and 5)
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    Development Day 1:
                                    <ul>
                                        <li>
                                            delayed development, lack of spontaneous movement,
                                            notochord malformation
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Development Day 5:
                                    <ul>
                                        <li>
                                            yolk sac edema observed, axial bend/defect observed, eye
                                            and surrounding region defect observed, shortened or
                                            malformed snout observed, malformed jaw observed, heart
                                            malformation or pericardial edema, brain malformation or
                                            necrosis , malformed, disorganized or missing somites,
                                            malformed or missing pectoral fin/caudal fin, lack of or
                                            overpigmentation, shorten, malformed or missing trunk,
                                            failure of swim bladder to inflate, notochord
                                            malformation
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Behavior Day 1:
                                    <ul>
                                        <li>
                                            Embryo photomotor response – total distance moved
                                            measured at 30 s of darkness (IR light, Background);
                                            first 1 s pulse of intense VIS light, 9 s darkness
                                            (Excitation); second pulse of VIS light, 10 s darkness
                                            (Refractory)
                                        </li>
                                        <li>
                                            Embryo movement pattern - the movement pattern is
                                            defined as a sequence of total distance moved recorded
                                            per 5s across background to refractory phase. Three
                                            metrics are used to quantify the similarity between a
                                            pair of embryos: Pearson’s r, Spearman’s rho, and cosine
                                            similarity. For further details on these metrics please
                                            see{' '}
                                            <a href="https://doi.org/10.1093/toxsci/kfy258">
                                                {' '}
                                                Hsieh et al., 2018
                                            </a>
                                            .
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Behavior Day 5
                                    <ul>
                                        <li>
                                            Larval photomotor response - total distance moved
                                            measured at a total of 3 light cycles, each cycle
                                            consisting of 3 min of alternating light and dark (L1,
                                            D1, L2, D2, L3, D3).
                                        </li>
                                        <li>
                                            Larval movement pattern – the movement pattern is
                                            defined as a sequence of total distance moved recorded
                                            per min across L1-D3. Three metrics are used to quantify
                                            the similarity between a pair of embryos: Pearson’s r,
                                            Spearman’s rho, and cosine similarity. For further
                                            details on these metrics please see{' '}
                                            <a href="https://doi.org/10.1093/toxsci/kfy258">
                                                {' '}
                                                Hsieh et al., 2018
                                            </a>
                                            .
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderBiobide = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td style={{ width: '45%' }}>Arantza Muriana, Biobide</td>
                        <td style={{ width: '45%' }} />
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td colSpan="2">Zebrafish strain AB</td>
                        <td />
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>Transgenetic embyros expressing GFP protein in the heart</td>
                        <td>Wildtype embryos </td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>24-well</td>
                        <td>96-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>2,4 days post fertilization (dpf)</td>
                        <td>5 days post fertilzation (dpf)</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>~5-100 μM</td>
                        <td> ~5-100 μM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>Mortality: percent mortality (days 2 and 4)</li>
                                <li>Development: percent embyros affected (days 2 and 4)</li>
                            </ul>
                        </td>
                        <td>Behavior: total distance moved and larval movement pattern (day 5)</td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    Development Day 2: microcephaly or abnormal head shape,
                                    microphthalmia/cyclopia, edema, edema,/irregular shape, abnormal
                                    heartbeat, absence heartbeat, length, curved/curled, notochord
                                    morphology, somite morphology, malformation of the tail
                                    (including tail fin), yolk deformation, yolk edema, yolk
                                    opacity, necrotic tissues, other
                                </li>
                                <li>
                                    Development Day 4: jaw morphology, microcephaly or abnormal head
                                    shape, microphthalmia/cyclopia, edema, malformation of the
                                    otoliths, edema,/irregular shape, abnormal heartbeat, absence
                                    heartbeat, length, curved/curled, notochord morphology, somite
                                    morphology, malformation of the tail (including tail fin), yolk
                                    deformation, yolk edema, yolk opacity, necrotic tissues,
                                    hatching, other
                                </li>
                            </ul>
                        </td>
                        <td>
                            Behavior:
                            <ul>
                                <li>
                                    Total distance moved measured at a total of 2 light cycles, each
                                    cycle consisting of 10 min of alternating light and dark (L1,
                                    D1, L2, D2).
                                </li>
                                <li>
                                    Larval movement pattern - the movement pattern is defined as a
                                    sequence of total distance moved recorded per 2 mins across L1
                                    to D2. Three metrics are used to quantify the similarity between
                                    a pair of embryos: Pearson’s r, Spearman’s rho, and cosine
                                    similarity. For further details on these metrics please see{' '}
                                    <a href="https://doi.org/10.1093/toxsci/kfy258">
                                        {' '}
                                        Hsieh et al., 2018
                                    </a>
                                    .
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderZeClinics = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Javier Terriente, ZeClinics</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>Zebrafish strain AB</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>Zebrafish embryos</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>96-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>1,2, 4 days post fertilization (dpf)</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>1, 3, 10, 30, 100 μM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>Mortality: percent mortality (days 1, 2, and 4)</li>
                                <li>Development: percent embryos affected (days 2 and 4) </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    Development Day 2: number of coagulated embryos, problems with
                                    tail detachment, problems with somite formation and absence of
                                    heart-beat, body deformations, scoliosis problems, yolk size
                                    problems, heart edema, heart beat problems, pigmentation
                                    problems and movement problems
                                </li>
                                <li>
                                    Development Day 4: body deformations, scoliosis problems, yolk
                                    size problems, heart edema, heart beat problems, pigmentation
                                    problems and movement problems
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderShafer = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Tim Shafer, USEPA</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>rat</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>primary cortical neurons and glia from 0-24 hr old rat pups</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>48-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>5, 7, 9, 12 days in vitro (DIV)</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>0.03, 0.1, 0.3, 1, 3, 10, 30 µM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>cell viability (LDH cytotox)</li>
                                <li>Mean firing rate</li>
                                <li>Bursts per minute</li>
                                <li>Number active electrodes</li>
                                <li>Number actively bursting electrodes</li>
                                <li>Percent spikes in burst</li>
                                <li>Number network spikes</li>
                                <li>Percent spikes in network spike</li>
                                <li>Mean correlation</li>
                                <li>Mutual information</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    cell viability (LDH cytotox): percentage of total LDH signal as
                                    compared to untreated control wells{' '}
                                </li>
                                <li>
                                    Mean firing rate: the mean firing rate (Hz) on each electrode
                                    was calculated, with the well level value the mean across all
                                    active electrodes
                                </li>
                                <li>
                                    Bursts per minute: Max-interval method used with parameters: ISI
                                    to start =0.1s, ISI to end =0.25s, min IBI =0.8, min duration
                                    =0.05s, min no. spikes = 5
                                </li>
                                <li>
                                    Number active electrodes: number of electrodes firing at or
                                    above 5 spikes per minute
                                </li>
                                <li>
                                    Number actively bursting electrodes: number of electrodes with
                                    burst rates of above 0.5 bursts per minute
                                </li>
                                <li>
                                    Percent spikes in burst: number of spikes within a burst over
                                    total spike count
                                </li>
                                <li>Number network spikes: number of spikes in network spikes</li>
                                <li>
                                    Percent spikes in network spike: ratio of spikes in network
                                    spikes over total spikes
                                </li>
                                <li>
                                    Mean correlation: the average of all pairwise correlation
                                    between all electrodes
                                </li>
                                <li>
                                    Mutual information: normalized mutual information contained
                                    within the network
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderLeist = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td style={{ width: '90%' }} colSpan="3">
                            Marcel Leist, University of Konstanz
                        </td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td colSpan="3">Human</td>
                    </tr>
                    <tr>
                        <th style={{ width: 150 }}>Assay Model</th>
                        <td style={{ width: '30%' }}>
                            LUHMES cells (CNS) - human mesencephalic (LUHMES) cells can be
                            differentiated to post-mitotic cells with biochemical, morphological and
                            functional features of dopaminergic (DAergic) neurons
                        </td>
                        <td style={{ width: '30%' }}>
                            embyronic derived peripherial neurons (PNS): human stem cells to
                            generate immature dorsal root ganglia neurons
                        </td>
                        <td style={{ width: '30%' }}>
                            neural crest cells (NCC) derived from human embryonic stem cells
                        </td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>96-well</td>
                        <td>96-well</td>
                        <td>96-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>24hr</td>
                        <td>24hr</td>
                        <td>24hr</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>highest conc 20 µM; follow-up with concentration ranges</td>
                        <td>highest conc 20 µM; follow-up with concentration ranges</td>
                        <td>highest conc 20 µM; follow-up with concentration ranges</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>CNS cell viability</li>
                                <li>CNS neurite outgrowth</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>PNS cell viability</li>
                                <li>PNS neurite outgrowth</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>NCC cell viability</li>
                                <li>NCC migration</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    cell viability: H-33342+/calcein-positive cells were analyzed as
                                    viable cells
                                </li>
                                <li>neurite outgrowth: defined by neurite area</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>
                                    cell viability: H-33342+/calcein-positive cells were analyzed as
                                    viable cells
                                </li>
                                <li>neurite outgrowth: defined by neurite area</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>
                                    cell viability: defined as the number of H-33342 and calcein
                                    double-positive cells
                                </li>
                                <li>
                                    migration: migration is measured as the number of cells
                                    repopulating a cell-free area
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderSirenko = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Oksana Sirenko, Molecular Devices</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>human</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>ipsc neurons from CDI</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>384-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>72 hr</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>0.3, 1, 3, 10, 30, 100 µM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>cell viability</li>
                                <li>total outgrowth</li>
                                <li>total branches</li>
                                <li>total processes</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>
                                    cell viability: number of Calcein AM positive viable cell bodies
                                    in the image
                                </li>
                                <li>
                                    total outgrowth: extent of the outgrowth, length of total
                                    outgrowth, and mean outgrowth per cell
                                </li>
                                <li>
                                    total branches: total number of branches and mean number of
                                    branches per cell
                                </li>
                                <li>
                                    total processes: total number of processes and mean number of
                                    processes per cell
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    renderWolozin = function() {
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: 150 }}>Provider</th>
                        <td>Ben Wolozin, Boston University</td>
                    </tr>
                    <tr>
                        <th>Assay Species</th>
                        <td>rat</td>
                    </tr>
                    <tr>
                        <th>Assay Model</th>
                        <td>PC12 cells stably transfected with wild type human TDP-43::GFP</td>
                    </tr>
                    <tr>
                        <th>Assay Plate Format</th>
                        <td>96-well</td>
                    </tr>
                    <tr>
                        <th>Assay Time Point</th>
                        <td>18 hr</td>
                    </tr>
                    <tr>
                        <th>Assay Dose Range</th>
                        <td>1.56, 6.25, 25, 100 µM</td>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <td>
                            <ul>
                                <li>cell viability</li>
                                <li>percent_aggregates</li>
                                <li>percent_TDPp</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Endpoint Descriptions</th>
                        <td>
                            <ul>
                                <li>cell viability: DAPI stain</li>
                                <li>
                                    percent_aggregates: detected as having diameter: 1µm min and 8µm
                                    max
                                </li>
                                <li>
                                    percent_TDPpositive: diffuse nuclear was detected as having
                                    diameter: 3µm min and 11µm max
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    },
    mapping = {
        'UCSanDiego 80 planaria behavior/development': renderCollins,
        'UCDavis 91 zebrafish behavior/development': renderLein,
        'OregonStateU 91 zebrafish behavior/development': renderTanguay,
        'Biobide 91 zebrafish behavior/development': renderBiobide,
        'ZeClinics 91 zebrafish development': renderZeClinics,
        'USEPA 91 neuron firing': renderShafer,
        'UKonstanz 80 neuron outgrowth/migration': renderLeist,
        'MolDevices 80 neuron outgrowth': renderSirenko,
        'BostonU 91 neuron protein accumulation': renderWolozin,
    };

class DatasetsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // HelpButtonWidget
            showHelpText: false,

            selectedAssay: _.keys(mapping)[0],
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(e) {
        this.setState({
            selectedAssay: e.target.value,
        });
    }

    _renderSelect() {
        let opts = _.keys(mapping);
        return (
            <div className="form-group">
                <label>Select an assay:</label>
                <select
                    className="form-control"
                    value={this.state.handleSelectChange}
                    onChange={this.handleSelectChange}
                >
                    {opts.map((d, i) => (
                        <option key={i} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    _renderHelpText() {
        if (!this.state.showHelpText) {
            return null;
        }
        return (
            <div className="alert alert-info">
                <h2>Help text</h2>
                <p>
                    This page allows for collaborators to compare basic assay parameters that were
                    provided to the NTP. This information may be useful when comparing results
                    (i.e., when a chemical is active or inactive) across endpoints and assays.
                </p>
            </div>
        );
    }

    render() {
        let tableFunction = mapping[this.state.selectedAssay];
        return (
            <div className="row-fluid">
                <div className="col-lg-12">
                    <h1>
                        Dataset descriptions
                        <HelpButtonWidget stateHolder={this} />
                    </h1>
                </div>
                <div className="col-lg-offset-1 col-lg-10">
                    {this._renderHelpText()}
                    {this._renderSelect()}
                    {tableFunction()}
                </div>
            </div>
        );
    }
}

export default DatasetsMain;
