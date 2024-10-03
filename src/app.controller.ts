import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { identity } from 'rxjs';
import { NewAccountDto } from './newAccount.dto';
import { Response } from 'express';
import { error } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  #accounts = [
    {
      id: '1234-5678',
      tulajdonos: 'Admin',
      balance: 15000
    },
    {
      id: '2222-3333',
      tulajdonos: 'UB',
      balance: 0
    },
    {
      id: '3333-4444',
      tulajdonos: 'GL',
      balance: 12000000
    }
  ]


  @Get('newAccount')
  @Render('newAccountForm')
  newAccountForm() {
    return {
      errors: [],
      data: {}
    }
  }

  @Post('newAccount')
  @Render('success')
  newAccount(
    @Body() accountData: NewAccountDto,
    @Res() response: Response
  ) {
    const errors: string[] = [];
    if(!accountData.balance || !accountData.id || !accountData.tulajdonos){
      errors.push("Minden mezőt meg kell adni👧🏽")
    }
    if(!/^\d{4}-\d{4}$/.test(accountData.id)){
      errors.push('A számlaszám nem megfelelő formátumú!!.🧛🏽‍♂️')
    }
    const balance = parseInt(accountData.balance)
    if(isNaN(balance)){
      errors.push('A kezdő egyenleg szám kell hogy legyen!👩🏿‍🦰')
    }
    if(balance < 0){
      errors.push('A kezdő egyenleg nem lehet negatív🎅🏿')
    }
    let newAccount = {
      id: accountData.id,
      tulajdonos: accountData.tulajdonos,
      balance: parseInt(accountData.balance)
    }

    if(errors.length > 0){
      response.render('newAccountForm', {
        errors,
        data: accountData
      })
      return;
    }
    if(this.#accounts.find(e => e.id == accountData.id) != undefined){
      errors.push('Ilyen számlaszám már van👨🏿‍🚒')
    }
    this.#accounts.push(newAccount)
    //303 -> /newAccountsSuccess
    response.redirect(303, 'newAccountSuccess')
  }

  @Get('newAccountSuccess')
  @Render('success')
  newaccountsuccess() {
    return {
      accounts: this.#accounts.length
    }
  }
}
