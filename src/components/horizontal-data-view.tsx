import { type DisplayColumnDef, createColumnHelper } from '@tanstack/react-table';
import { mapEntries } from 'radashi';

import { DataTable } from '@/components/ui/data-table';
import {
  type Data,
  type Field,
  type View,
  type ViewField,
  dataValueSchema,
} from '@/lib/matrix/types';

const wrapData = (fields: Field[], data: Data) =>
  mapEntries(data, (key, value) => {
    const field = fields.find((field) => field.id === key);
    const k = field?.name ?? key;
    const v = field?.type === 'date' ? new Date(value as number).toLocaleDateString() : value;
    return [k, v];
  });

const columnForField = (field: ViewField) => {
  const def: DisplayColumnDef<Data> = {
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
        // TODO: 单位转换
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
