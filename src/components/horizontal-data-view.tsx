import { type DisplayColumnDef, createColumnHelper } from '@tanstack/react-table';
import { mapKeys } from 'radashi';

import { DataTable } from '@/components/ui/data-table';
import { type Data, type Field, type View, dataValueSchema } from '@/lib/matrix/types';

const wrapData = (fields: Field[], data: Data) =>
  mapKeys(data, (key) => fields.find((field) => field.id === key)?.name ?? key);

const columnForField = (field: Field) => {
  const def: DisplayColumnDef<Data> = {
    id: field.id,
  };

  if (field.units && field.units.length > 0) {
    def.header = `${field.name} (${field.units[0]})`;
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
      def.meta = { className: 'text-end font-mono' };
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
  const fns = view.fields.map((field) => new Function('data', field.formula));

  const columnHelper = createColumnHelper<Data>();
  const columns = view.fields.map((field, index) =>
    columnHelper.accessor((row) => {
      const result = dataValueSchema.safeParse(fns[index](wrapData(fields, row)));

      if (result.success) {
        if (typeof result.data === 'string' || typeof result.data === 'number') {
          return result.data;
        }

        return result.data.value;
      }

      return null;
    }, columnForField(field)),
  );

  return <DataTable className="grow" columns={columns} data={data} />;
}
