/* tslint:disable */
export type GeneralSetting = {
    id?: number;
    reimbursable_expenses_object: string;
    corporate_credit_card_expenses_object: string;
    import_projects?: boolean;
    import_tax_items: boolean;
    change_accounting_period: boolean;
    import_categories: boolean;
    sync_fyle_to_netsuite_payments: boolean;
    sync_netsuite_to_fyle_payments: boolean;
    auto_create_destination_entity: boolean;
    auto_create_merchants: boolean;
    auto_map_employees: string;
    employee_field_mapping: string;
    memo_structure?: string[];
    map_fyle_cards_netsuite_account: boolean;
    skip_cards_mapping?: boolean;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
};
