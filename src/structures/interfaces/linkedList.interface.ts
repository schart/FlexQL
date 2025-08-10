export interface LinkedListInterface {
  logic: string | null; // AND = ; - OR = ,
  comparison: any; // { column: username, op: ==, value: Joe }
  next: LinkedListInterface | null;
}
