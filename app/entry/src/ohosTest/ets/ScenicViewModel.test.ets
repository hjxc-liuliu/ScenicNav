import { describe, expect, it } from '@ohos/hypium';
import { ScenicViewModel } from '../../main/ets/viewmodel/ScenicViewModel';

export default function scenicViewModelTest(): void {
  describe('ScenicViewModel', () => {
    const viewModel = new ScenicViewModel();

    it('formats ticket price in yuan', 0, () => {
      expect(viewModel.formatPrice(128)).assertEqual('￥128.00');
    });

    it('selects a matching leisure route', 0, () => {
      expect(viewModel.recommendRoute('休闲').id).assertEqual('leisure');
    });

    it('estimates wait safely when service is unavailable', 0, () => {
      expect(viewModel.estimatedWait(10, 0)).assertEqual(0);
    });
  });
}
