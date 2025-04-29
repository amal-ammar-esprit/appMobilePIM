// related.dto.ts
import { IsString } from 'class-validator';

export class RelatedDto {
  @IsString()
  userId: string;
}
