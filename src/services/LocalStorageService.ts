export default class LocalStorageService {

    private static KEY = "DECENTRYFI_KICKSTART";

    static setItem(key : any, value : any) {
        const storage = this.get();
        storage[key] = value;
        localStorage.setItem(this.KEY, JSON.stringify(storage));
    }

    static get() {
        return this.isInUse ? JSON.parse(localStorage.getItem(this.KEY) as string) : {};
    }

    private static get isInUse() {
        return localStorage.getItem(this.KEY) !== null;
    }
}