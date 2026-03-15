import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private userservice : UserService){}

    @Post()
    addUser(@Body() createuserdto : CreateUserDto){
        console.log("Adding User - Msg from User's Controller");
        return this.userservice.adduser(createuserdto);
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    getUsers(@Req() req : Request){
        console.log(req.headers['authorization']);
        console.log("Getting all user's data - Msg from User's Controller");
        return this.userservice.getusers();
    }

}
