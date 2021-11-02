import DoseResponseMain from './containers/DoseResponseMain';

import { insertIntoDom } from './shared';

const renderDoseResponse = (el) => insertIntoDom(DoseResponseMain, el);

export { renderDoseResponse };
