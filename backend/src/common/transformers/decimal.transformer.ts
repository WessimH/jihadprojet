import Decimal from 'decimal.js';
import type { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(entityValue: Decimal | string | number | null): string | null {
    if (entityValue === null || typeof entityValue === 'undefined') {
      return null;
    }
    return new Decimal(entityValue).toString();
  }

  from(databaseValue: string | null): Decimal | null {
    if (databaseValue === null || typeof databaseValue === 'undefined') {
      return null;
    }
    return new Decimal(databaseValue);
  }
}
