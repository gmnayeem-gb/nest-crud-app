import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    geData() {
        return {
            success: true,
            message: "Welcome to NestJS!",
            data: [
                { id: 1, name: "John Doe" },
                { id: 2, name: "Jane Smith" },
                { id: 3, name: "Bob Johnson" }
            ]
        }
    }
}