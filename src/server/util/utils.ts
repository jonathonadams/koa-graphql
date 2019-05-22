export class Utils {
  static swapId(object: any): any {
    if (object._id) {
      [object._id, object.id] = [object.id, object._id];
    }
    return object;
  }
}
