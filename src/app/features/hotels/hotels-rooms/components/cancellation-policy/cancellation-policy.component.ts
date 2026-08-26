import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent {
  constructor(
    public dialogRef: MatDialogRef<CancellationPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  isFreeCancellation(rule: any): boolean {
    if (!rule) return true;
    const price = rule.Price ?? rule.price;
    const cost = rule.Cost ?? rule.cost;
    if ((price !== undefined && price !== null && +price > 0) || (cost !== undefined && cost !== null && +cost > 0) || rule.IsCancelRestricted) {
      return false;
    }
    return true;
  }
}
