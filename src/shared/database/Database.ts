abstract class Database {
  abstract list(): any[];
  abstract create(data: any): void;
}


export default Database;