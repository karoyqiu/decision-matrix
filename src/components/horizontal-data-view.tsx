import { createColumnHelper } from '@tanstack/react-table';
import { mapKeys } from 'radashi';

import { DataTable } from '@/components/ui/data-table';
import { type Data, type Field, type View, dataValueSchema } from '@/lib/matrix/types';

const wrapData = (fields: Field[], data: Data) =>
  mapKeys(data, (key) => fields.find((field) => field.id === key)?.name ?? key);

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
    columnHelper.accessor(
      (row) => {
        const result = dataValueSchema.safeParse(fns[index](wrapData(fields, row)));

        if (result.success) {
          if (typeof result.data === 'string' || typeof result.data === 'number') {
            return result.data;
          }

          if (!result.data.unit) {
            return result.data.value;
          }

          return `${result.data.value} ${result.data.unit}`;
        }

        return null;
      },
      {
        id: field.id,
        header: field.name,
        meta: {
          className: 'text-end font-mono',
        },
      },
    ),
  );

  return <DataTable className="grow" columns={columns} data={data} />;
}
