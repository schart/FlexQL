export interface linkedListInterface {
  logic: string | null; // AND = ? - OR = ?
  comparison: any; // { column: username, op: ==, value: Joe }
  next: linkedListInterface | null;
}
