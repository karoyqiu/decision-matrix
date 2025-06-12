import { type DisplayColumnDef, createColumnHelper } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { type ViewData, wrapData } from '@/lib/dataView';
import { type Data, type Field, type View, type ViewField } from '@/lib/matrix/types';

const columnForField = (field: ViewField) => {
  const def: DisplayColumnDef<ViewData> = {
    id: field.id,
  };

  if (field.unit) {
    def.header = `${field.name} (${field.unit})`;
  } else if (field.currency) {
    def.header = `${field.name} (${field.currency})`;
  } else {
    def.header = field.name;
  }

  switch (field.type) {
    case 'date':
    case 'float':
    case 'int':
    case 'money':
      def.meta = { className: `text-end font-mono` };
      break;

    default:
      break;
  }

  return def;
};

type HorizontalDataViewProps = {
  fields: Field[];
  data: Data[];
  view: View;
};

export function HorizontalDataView(props: HorizontalDataViewProps) {
  const { fields, data, view } = props;
  const viewData = wrapData(fields, data, view.fields);

  const columnHelper = createColumnHelper<ViewData>();
  const columns = view.fields.map((field) =>
    columnHelper.accessor(field.id, columnForField(field)),
  );

  return <DataTable className="grow" columns={columns} data={viewData} />;
}
