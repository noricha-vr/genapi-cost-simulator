import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { languageTag, sourceLanguageTag } from '$paraglide/runtime.js';

export const handle = async ({ event, resolve }) => {
    const url = new URL(event.request.url);
    const path = url.pathname.slice(base.length);

    // ルートURLにアクセスした場合の処理
    if (path === '/') {
        // デフォルト言語を使用する場合
        let targetLang = sourceLanguageTag;

        // (オプション) ブラウザの言語設定を検出して使用する場合
        const acceptLanguage = event.request.headers.get('accept-language');
        if (acceptLanguage) {
            const browserLangs = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
            // ここで languageTags の代わりに別の方法で言語をチェックする必要があります
            // 例: プロジェクトでサポートしている言語のリストを定義
            const supportedLanguages = ['en', 'ja', 'de']; // プロジェクトに応じて調整
            const supportedLang = browserLangs.find(lang => supportedLanguages.includes(lang));
            if (supportedLang) {
                targetLang = supportedLang;
            }
        }

        // リダイレクト
        throw redirect(307, `/${targetLang}`);
    }

    return resolve(event);
};
