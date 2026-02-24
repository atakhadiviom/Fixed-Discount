{
    'name': 'POS Fixed Discount',
    'version': '1.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Modify POS Discount button to ask for a fixed amount instead of a percentage.',
    'depends': ['point_of_sale', 'pos_discount'],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_fixed_discount/static/src/app/control_buttons/discount_button.js',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
