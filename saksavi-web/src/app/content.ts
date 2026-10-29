/**
 * Site content in one place. Anything marked `pending` is a placeholder the
 * client must replace with verified facts; the page labels it as such.
 */

export interface Good {
  mark: string;
  name: string;
  form: string;
  use: string;
}

export const GOODS: Good[] = [
  {
    mark: 'SH',
    name: 'Semi-husked coconuts',
    form: 'Mature brown nut with a tuft of husk left on top, which protects the eyes in transit.',
    use: 'Retail shelves, households and kitchens',
  },
  {
    mark: 'DH',
    name: 'Dehusked coconuts',
    form: 'Mature nut with the husk fully removed, shell clean.',
    use: 'Processors, wholesale and food service',
  },
  {
    mark: 'TC',
    name: 'Tender coconuts',
    form: 'Young green coconut, harvested for its water.',
    use: 'Coconut water, juice bars, fresh retail',
  },
  {
    mark: 'CP',
    name: 'Copra',
    form: 'Dried coconut kernel.',
    use: 'Oil milling',
  },
  {
    mark: 'CO',
    name: 'Coconut oil',
    form: 'Oil pressed from coconut kernel.',
    use: 'Cooking, food manufacturing, cosmetics',
  },
  {
    mark: 'DC',
    name: 'Desiccated coconut',
    form: 'Grated, dried coconut kernel.',
    use: 'Bakery, confectionery, snacks',
  },
];

export const PRODUCT_OPTIONS = GOODS.map((g) => g.name);

export interface Stage {
  no: string;
  name: string;
  record: string;
}

export const STAGES: Stage[] = [
  { no: '01', name: 'Grown', record: 'On the palm until fully mature' },
  { no: '02', name: 'Harvested', record: 'Ripe nuts come down from the crown' },
  { no: '03', name: 'Collected', record: 'Loaded by truck at the grove' },
  { no: '04', name: 'Shipped', record: 'Containerised and sailed to your port' },
];

/** Registrations an exporter normally shows. Values are pending until supplied. */
export const PAPERS = [
  { label: 'Importer-Exporter Code (IEC)', value: null as string | null },
  { label: 'APEDA registration (RCMC)', value: null as string | null },
  { label: 'FSSAI licence', value: null as string | null },
  { label: 'Coconut Development Board registration', value: null as string | null },
];

/**
 * Where enquiries go. Leave empty until the client confirms a channel; the
 * form then explains that the channel is not connected instead of pretending
 * to send.
 */
export const ENQUIRY = {
  email: '',
  whatsapp: '', // international format, digits only, e.g. 9198XXXXXXXX
};
