# Simple Multi Tenancy

> This is a [Vemto](https://vemto.app) plugin. Vemto is a GUI [Laravel](https://laravel.com) generator with a complete set of tools for starting new [Laravel](https://laravel.com) projects. 

This plugin is intended to bring simple User Login multi-tenancy to your Vemto Laravel projects.

It adds a Trait (**BelongsToTenant.php**) to all models you marked as "owned by tenant", making it possible to create and list records that are owned by the **Authenticated User**.

## Settings

This plugin has only two simple settings:

- Tenant field name: the field that is used to identify the tenant (the authentication model, that is **User** by default)
- Models owned by tenant - the models owned by the tenant - it is recommended to mark only models directly related to the "User" model (models that have a **belongsTo:user** relationship).

![image](https://user-images.githubusercontent.com/11933789/131032403-c9405bda-80f3-41cc-8708-e1734c340cae.png)

After marking a model as "owned by tenant", it will show a small yellow marker on the Schema Editor:

![image](https://user-images.githubusercontent.com/11933789/131032362-21d67974-f78a-49b6-94a8-4c5941605645.png)

> **IMPORTANT:** - all fields marked as "owned by tenant" need to have a **belongsTo:user** (or whatever authentication model you are using) and the relationship FK field needs to have the same name you configured on the *Plugin Settings*.

![image](https://user-images.githubusercontent.com/11933789/131034172-984fcff8-07f9-487d-8a34-71e17212b152.png)

## Trait Scope

After generating the code, this plugin will add the trait **BelongsToTenant.php** to the models marked as "owned by tenant".

All models with that trait have a [Global Scope](https://laravel.com/docs/8.x/eloquent#global-scopes) that automatically saves the **user_id** (or the field you configured) and retrieves the data based on the **Authenticated User**.

If you want to retrieve something without the Tenancy Scope, you can use the **withoutTenancy** method. For example:

```php
Order::all(); // Return all orders owned by the authenticated user

Order::withoutTenancy()->all(); // Return all orders from the database
```