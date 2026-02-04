import * as rawSchema from "@ccpp/shared/schema";

type SchemaModule = typeof rawSchema & { default?: typeof rawSchema };

export const schema = (rawSchema as SchemaModule).default ?? rawSchema;
