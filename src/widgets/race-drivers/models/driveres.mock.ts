interface Driver {
    id: number;
    name: string;
    image: string;
}

import oscarPiastriImage from '@/shared/assets/images/drivers/oscar-piastri.avif';
import landoNorrisImage from '@/shared/assets/images/drivers/lando-norris.avif';

export const drivers: Driver[] = [
    { id: 1, name: 'Oscar Piastri', image: oscarPiastriImage },
    { id: 2, name: 'Lando Norris', image: landoNorrisImage }
];