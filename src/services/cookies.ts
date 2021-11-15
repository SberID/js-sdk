interface CookieProps {
    expires?: number | Date | string;
    path?: string;
    domain?: string;
    sameSite?: string;
    secure?: boolean;
}

export class Cookies {
    static get(name: string): string | undefined {
        const matches = document.cookie.match(
            new RegExp(
                '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)',
            ),
        );

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static set(name: string, value: string, props: CookieProps = {}): void {
        let expires = props.expires;

        if (typeof expires === 'number' && expires) {
            const d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = props.expires = d;
        }
        if (expires instanceof Date) {
            props.expires = expires.toUTCString();
        }

        name = encodeURIComponent(String(name))
            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
            .replace(/[\(\)]/g, escape);

        value = encodeURIComponent(String(value)).replace(
            /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
            decodeURIComponent,
        );

        let updatedCookie = `${name}=${value}`;

        for (const propName in props) {
            if (!props[propName]) {
                continue;
            }
            updatedCookie += `; ${propName}`;

            if (props[propName] === true) {
                continue;
            }

            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (';') character:
            // Consume the characters of the unparsed-attributes up to, not including, the first %x3B (';') character.
            updatedCookie += `=${props[propName].split(';')[0]}`;
        }

        document.cookie = updatedCookie;
    }

    static delete(name: string): void {
        this.set(name, '', {expires: -1});
    }
}
