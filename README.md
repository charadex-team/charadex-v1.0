# Charadex v.1.5.5

> [!IMPORTANT]
> You can (tentatively) use this branch in development. **It is fully compatible with with the [Charadex v1.5.0 Google Sheet](https://docs.google.com/spreadsheets/d/1GwgfLizD3HQCieGia6di-TfU4E3EipT9Jb0BDZQwNak/).**
> It can work with older sheets as well but it'll take a bit of work.

## Changelog

- Complete rehaul of the JavaScript to be more modular.
- Hopefully fixed links - no more ugly extra slashes.
- Added ability to apply multiple ListJS filters.
- Added ability to filter out the gallery by URL parameters (there is no UI implementation for this yet.)
- Folders now use their own special `folder` property that's determined by your chosen key to prevent filters clashing.
- Profiles now use a universal `profileid` and `profilelink` instead of one of the original properties. (i.e. Profile links will look like ...charadex.com/masterlist.html?profile=CHA0001). Old links to profiles will still work by filtering out the gallery based on the property. (i.e. ?design=CHA0001 will bring users to the gallery but will only that specific design will show.)
- Ability to create grouped galleries - you'll be able to see these prominently on User Profiles. Their inventories are grouped and can be searched and filtered.
- User Profiles now have Owned Designs.
- The tags in the FAQs now work correctly and users will be able to click tags to bring them to other questions with the same tags.
- Rarities have pretty badges that you'll be able to change the colors to in the CSS.
- The index page lists have been overhauled a fair bit.
- Fixed the meta tags, I have no idea where I got property instead of name.
- Lots of other goodies, feel free to crack it open.

&nbsp;

> [!WARNING]
> If you are using an older version of the sheet and want to update to v1.5.0, don't upgrade just yet. Charadex v1.5.6 will be out soon and will have a lot more tools to help you organize your data.

&nbsp;

## Community Help

If you're using this version and find any bugs, please let me know in the [Discord Server](https://discord.gg/3ghSjBug6a), or make an [issue](https://github.com/charadex-team/charadex-v1.0/issues).

&nbsp;

## Navigation

**Download**

- [Charadex](https://github.com/charadex-team/charadex-v1.0/archive/refs/heads/v1.5.5-develop.zip)
- [Google Sheet](https://docs.google.com/spreadsheets/d/1GwgfLizD3HQCieGia6di-TfU4E3EipT9Jb0BDZQwNak/copy)

**Setting Up**

- [Getting Started](https://github.com/charadex-team/charadex-v1.0/wiki/Getting-Started)
- [Hosting](https://github.com/charadex-team/charadex-v1.0/wiki/Hosting)
- [Sheet Set-Up](https://github.com/charadex-team/charadex-v1.0/wiki/Sheet-Set-Up)
- [Site Set-Up](https://github.com/charadex-team/charadex-v1.0/wiki/Site-Set-Up)

**Other Information**

- [FAQ](https://github.com/charadex-team/charadex-v1.0/wiki/FAQ)
- [Credits](https://github.com/charadex-team/charadex-v1.0/wiki#credits)
- [License](https://github.com/charadex-team/charadex-v1.0/wiki#license)

**Extra**

- [Discord Server](https://discord.gg/3ghSjBug6a)
- [Support Charadex](https://ko-fi.com/charadex)
- [Example Site](https://charadex-team.github.io/charadex-v1.0/index.html)
- [Example Sheet](https://docs.google.com/spreadsheets/d/1GwgfLizD3HQCieGia6di-TfU4E3EipT9Jb0BDZQwNak/edit?usp=sharing)