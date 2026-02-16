type DropdownItem = {
  id: number | string;
  name: string;
};

export const getLabel = <T extends DropdownItem>(
  list: T[],
  id?: string | number,
) => list.find((i) => String(i.id) === String(id))?.name || "";
