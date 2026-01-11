import { Module } from '@nestjs/common';
import { MenuItemsResolver } from './menu-items.resolver';
import { MenuItemsService } from './menu-items.service';

@Module({
    providers: [MenuItemsResolver, MenuItemsService],
})
export class MenuItemsModule { }
