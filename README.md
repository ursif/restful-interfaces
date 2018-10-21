# @ursif/restful-interfaces

## Overview

This project showcases how to create a RESTful interface on top of a PostgresDB.

## Usage

If you want to use this as a boilerplate, here's some things that we found
helpful

- Delete all of the files inside of `transformations/`, `validations/`, and
  `/queries` **except** for the `index.js` files.

  - You will want to then go back and add the files as you need them.

- Update the `routes` value inside of `configuration/` to be reflective of the
  REST routes that you want to expose for your DB.

- _Now_, go back and add the `validations`, `transformations`, and `queries` of
  your routes, using the `<route>.js` filenaming structure.

  - Example: If you have `routes: ['asks','users']`, you will want to have the
    following folder structure:

    ```
    transformations/
      - users.js
      - asks.js
      - index.js
    queries/
      - users.js
      - asks.js
      -index.js
    validations/
      - users.js
      - asks.js
      - index.js
    ```

  - _**Note**_: You don't need to add `transformations` or `queries` if you do
    not need them. However, you _**do**_ need to have `validations` for _every_
    route you expose.

### Checking Types

You can check the types of the current database that this is wrapping by going
to `GET /schemas`. That will return the schemas of the available tables that you
an add routes for.
