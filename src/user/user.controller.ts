import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './schemas/user-schema';
import { IUser } from './dto/user.inetrface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatorMongoIdPipe } from './pipes/validator-mongo-id.pipe';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';

@ApiTags('Users CRUD')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('')
  getAllUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @Get('/:id')
  getUser(@Param('id', ValidatorMongoIdPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUserByProperty(id, param);
  }

  @Put('role/:id')
  changeUserRole(
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserRoleDto,
  ): Promise<IUser> {
    return this.userService.updateRoleByUserId(id, param);
  }

  @Put('status/:id')
  changeUserStatus(
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserStatusDto,
  ): Promise<IUser> {
    return this.userService.updateStatusByUserId(id, param);
  }

  @Delete(':id')
  DeleteUser(@Param('id', ValidatorMongoIdPipe) id: string): Promise<IUser> {
    return this.userService.removeUserById(id);
  }
}
