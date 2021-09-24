/* tslint:disable */
import { MappingDestination } from "./mapping-destination.model";

export type GroupedDestinationAttributes = {
    VENDOR_PAYMENT_ACCOUNT?: MappingDestination[];
    VENDOR?: MappingDestination[];
    CLASS?: MappingDestination[];
    ACCOUNTS_PAYABLE?: MappingDestination[];
    EMPLOYEE?: MappingDestination[];
    ACCOUNT?: MappingDestination[];
    SUBSIDIARY?: MappingDestination[];
    CURRENCY?: MappingDestination[];
    DEPARTMENT?: MappingDestination[];
    PROJECT?: MappingDestination[];
    TAX_ITEM?: MappingDestination[];
    LOCATION?: MappingDestination[];
    EXPENSE_CATEGORY?: MappingDestination[];
    BANK_ACCOUNT?: MappingDestination[];
    CREDIT_CARD_ACCOUNT?: MappingDestination[];
};
