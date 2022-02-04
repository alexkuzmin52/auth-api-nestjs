import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthId } from '../decorators/auth-id.decorator';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { IUser } from './dto/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user-schema';
import { UserFilterQueryDto } from './dto/user-filter-query.dto';
import { UserRole } from '../decorators/user-role.decorator';
import { UserRoleEnum } from './constants/user-role-enum';
import { UserRoleGuard } from '../guards/user-role.guard';
import { UserService } from './user.service';
import { ValidatorMongoIdPipe } from './pipes/validator-mongo-id.pipe';

@ApiTags('Users CRUD')
@UserRole(UserRoleEnum.ADMIN)
@Controller('users')
@UseGuards(UserRoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('')
  @ApiSecurity('access-key')
  getAllUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:id')
  @ApiSecurity('access-key')
  getUser(@Param('id', ValidatorMongoIdPipe) id: string): Promise<IUser> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.USER)
  @Put('')
  @ApiSecurity('access-key')
  updateUser(
    @AuthId() authId: string,
    @Body() param: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUserByProperty(authId, param);
  }

  @ApiOperation({ summary: 'Change role of user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Put('role/:id')
  @ApiSecurity('access-key')
  changeUserRole(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserRoleDto,
  ): Promise<IUser> {
    return this.userService.updateRoleByUserId(id, param, authId);
  }

  @ApiOperation({ summary: 'Change status of user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Put('status/:id')
  @ApiSecurity('access-key')
  changeUserStatus(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserStatusDto,
  ): Promise<IUser> {
    return this.userService.updateStatusByUserId(id, param, authId);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.USER)
  @Put('pass')
  @ApiSecurity('access-key')
  changeUserPassword(
    @Req() req,
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
  ): Promise<object> {
    return this.userService.changePassword(
      req.headers.authorization,
      changeUserPasswordDto,
    );
  }

  @ApiOperation({ summary: 'Delete user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Delete(':id')
  @ApiSecurity('access-key')
  deleteUser(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
  ): Promise<IUser> {
    return this.userService.removeUserById(id, authId);
  }

  @ApiOperation({ summary: 'Get users by filter' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiSecurity('access-key')
  @Get('filter/query')
  getUsers(
    @AuthId() authId: string,
    @Query() query: UserFilterQueryDto,
  ): Promise<IUser[]> {
    return this.userService.getUsersByFilter(query);
  }
}
