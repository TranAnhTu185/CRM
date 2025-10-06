import { makeAutoObservable, makeObservable, observable, toJS } from "mobx";

export class UserTaskStore {
    userTask: any | {} = {};
    constructor() {
        makeAutoObservable(this);
        // super();
        // makeObservable(this, {
        //     userTask: observable,
        // });
         this.loadFromStorage();
    }

    setUserTask(userTask: any) {
        debugger;
        this.userTask = userTask;
        localStorage.setItem("userTask", JSON.stringify(toJS(userTask)));
    }

    clearUserTask() {
        this.userTask = {};
        localStorage.removeItem("userTask");
    }

    loadFromStorage() {
        const data = localStorage.getItem("userTask");
        if (data) {
            this.userTask = JSON.parse(data);
        }
    }


    get getUserTask() {
        // ✅ dùng toJS để lấy ra bản sao thường (không Proxy)
        return toJS(this.userTask);
    }
}