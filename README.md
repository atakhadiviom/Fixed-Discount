# POS Fixed Discount for Odoo 19

This Odoo 19 module modifies the default behavior of the `pos_discount` module in the Point of Sale. Instead of asking for a percentage, the global "Discount" button now prompts the cashier to enter a **Fixed Amount**.

## Features

- **Flexible Discount Options**: The global "Discount" button now prompts the cashier to choose between **Percentage (%)** and **Fixed Amount**.
- **Fixed Amount Conversion**: When a fixed amount is entered, the module automatically calculates the equivalent percentage based on the order total without tax: `(Fixed Amount / Total Order Amount) * 100`.
- **Native Compatibility**: Regardless of the input type, the final discount is applied via Odoo's native `apply_discount` function. This ensures that receipts, order lines, and accounting reports correctly display the discount as a percentage.
- **Safety Checks**: Includes validation to prevent division by zero or applying discounts on orders with zero or negative totals.

## Installation

1. Clone this repository into your Odoo custom addons directory.
2. Update the Odoo Apps list.
3. Install the `pos_fixed_discount` module.
4. Ensure the `pos_discount` module (standard Odoo) is also installed and configured in your POS settings.

## Technical Details

- **Module Name**: `pos_fixed_discount`
- **Dependencies**: `point_of_sale`, `pos_discount`
- **Frontend Framework**: Owl (Odoo 19)
- **Patching Strategy**: Uses the `patch` utility to override the `onClick` method of `DiscountButton`.

## How it works

When the cashier clicks the "Discount" button:
1. A popup appears asking for a "Discount Amount".
2. The code calculates the percentage: `pc = (amount / total_without_tax) * 100`.
3. The calculated percentage `pc` is applied to the order.

This ensures that while the user enters a fixed value, Odoo's underlying engine handles it as a standard percentage discount for reporting and accounting purposes.
