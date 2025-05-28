import Database from "./Database";
class DatabaseAdapter {
  constructor(private database: Database) {}

  list = (): any[] => {
    return this.database.list();
  };

  create = (data: any): void => {
    this.database.create(data);
  };
}
