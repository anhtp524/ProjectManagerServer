import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/Auth/guard/role.guard";
import { Role } from "../Account/enum/role.enum";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";
import { EmployeeService } from "./employee.service";

@Controller('/employee')
@UseGuards(AuthGuard('jwt'))
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    @Post()
    @UseGuards(new RolesGuard(Role.ADMIN))
    createEmployee(@Body() newEmployee: CreateEmployeeDto) {
        return this.employeeService.createEmployee(newEmployee)
    }

    @Get()
    getAllEmployee(@Query() {limit, page} : {limit: number, page: number}) {
        return this.employeeService.getAllEmployee(limit, page)
    }
    
    @Get('statistical')
    countEmployees(@Query() {technology}: {technology: string}) {
        return this.employeeService.countEmployees(technology)
    }

    @Get('/:id')
    getEmployeeById(@Param('id') id: string) {
        return this.employeeService.getEmployeeById(id)
    }

    @Patch('/:id')
    @UseGuards(new RolesGuard(Role.ADMIN))
    updateEmployee(@Param('id') id: string, @Body() updateEmployee: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(id, updateEmployee)
    }

    @Delete(':id')
    @UseGuards(new RolesGuard(Role.ADMIN))
    deleteEmployee(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id)
    }


}
