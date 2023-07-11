import type {
    ClassNameFormatter as ClassNameFormatterBase,
    ClassNameList,
    NoStrictEntityMods,
    Preset,
} from '@bem-react/classname';
import {withNaming} from '@bem-react/classname';

interface ClassNameFormatter extends ClassNameFormatterBase {
    (mods?: NoStrictEntityMods | null, mix?: string): string;
    (elemName: string, elemMix?: string): string;
    (elemName: string, elemMods?: NoStrictEntityMods | null, elemMix?: string): string;
}

function setup(preset: Preset) {
    const cn = withNaming(preset);
    return function (className: string): ClassNameFormatter {
        const block = cn(className);
        return (
            elemOrMod?: string | NoStrictEntityMods | null,
            modOrMix?: NoStrictEntityMods | string | ClassNameList | null,
            mix?: string | ClassNameList,
        ) => {
            if (typeof elemOrMod === 'string') {
                if (typeof modOrMix === 'string') {
                    return block(elemOrMod, [modOrMix]);
                }
                if (Array.isArray(modOrMix)) {
                    return block(elemOrMod, modOrMix);
                }
                if (typeof mix === 'string') {
                    return block(elemOrMod, modOrMix, [mix]);
                }
                return block(elemOrMod, modOrMix, mix);
            }
            if (typeof modOrMix === 'string') {
                return block(elemOrMod, [modOrMix]);
            }
            return block(elemOrMod, modOrMix as ClassNameList);
        };
    };
}

export const NAMESPACE = 'ra-';

export const cn = setup({n: NAMESPACE, e: '__', m: '_'});
