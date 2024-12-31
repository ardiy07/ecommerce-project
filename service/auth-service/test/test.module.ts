import { TestService } from "./test.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [TestService],
})

export class TestModule {}