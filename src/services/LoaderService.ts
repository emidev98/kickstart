import { BehaviorSubject } from "rxjs";

export default class LoaderService {
	static observers = new BehaviorSubject(false);
	
	static loading = (status: boolean) => this.observers.next(status);
}
