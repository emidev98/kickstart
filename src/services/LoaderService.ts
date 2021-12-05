export default class LoaderService {
	private static observers = new Array<Function>();

	static attach = (fn: Function) => {
		this.observers.push(fn);
	};

	static setLoading = (status: boolean) => {
		this.observers.forEach((fn) => fn(status));
	};
}
