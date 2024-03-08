function filterMessages(originalData) {
    // Access the nested messages array
    var nestedMessages = originalData.messages[0].messages;
    return nestedMessages.map(function (msg) {
        var _a, _b, _c, _d;
        // Prepare the files array if it exists, focusing on the thumb_720 property
        var files = ((_a = msg.files) === null || _a === void 0 ? void 0 : _a.filter(function (file) { return file.thumb_720; }).map(function (file) { return ({
            thumb_720: file.thumb_720,
        }); })) || [];
        return {
            user: (_b = msg.user) !== null && _b !== void 0 ? _b : undefined,
            text: (_c = msg.text) !== null && _c !== void 0 ? _c : "No text available",
            ts: (_d = msg.ts) !== null && _d !== void 0 ? _d : "No timestamp",
            files: files.length > 0 ? files : undefined,
        };
    });
}
var originalData = {
    messages: [
        {
            ok: true,
            messages: [
                {
                    subtype: "channel_join",
                    user: "U06NGBLC9U3",
                    text: "<@U06NGBLC9U3> has joined the channel",
                    inviter: "U02EG90CQU9",
                    type: "message",
                    ts: "1709850020.672519",
                },
                {
                    text: "another big number alert:\n\nPDC recently hit *20k organic* from the serp in a 28d span for the first time ever!\nNext up is 25k!",
                    files: [
                        {
                            id: "F06N0KY31EE",
                            created: 1709655773,
                            timestamp: 1709655773,
                            name: "image.png",
                            title: "image.png",
                            mimetype: "image/png",
                            filetype: "png",
                            pretty_type: "PNG",
                            user: "U02EG90CQU9",
                            user_team: "T02ASPNRZ",
                            editable: false,
                            size: 92443,
                            mode: "hosted",
                            is_external: false,
                            external_type: "",
                            is_public: true,
                            public_url_shared: false,
                            display_as_bot: false,
                            username: "",
                            url_private: "https://files.slack.com/files-pri/T02ASPNRZ-F06N0KY31EE/image.png",
                            url_private_download: "https://files.slack.com/files-pri/T02ASPNRZ-F06N0KY31EE/download/image.png",
                            media_display_type: "unknown",
                            thumb_64: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_64.png",
                            thumb_80: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_80.png",
                            thumb_360: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_360.png",
                            thumb_360_w: 275,
                            thumb_360_h: 360,
                            thumb_480: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_480.png",
                            thumb_480_w: 367,
                            thumb_480_h: 480,
                            thumb_160: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_160.png",
                            thumb_720: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_720.png",
                            thumb_720_w: 550,
                            thumb_720_h: 720,
                            thumb_800: "https://files.slack.com/files-tmb/T02ASPNRZ-F06N0KY31EE-0a78c938da/image_800.png",
                            thumb_800_w: 611,
                            thumb_800_h: 800,
                            original_w: 727,
                            original_h: 952,
                            thumb_tiny: "AwAwACTToopCQKADHuaWmg+5/KnUAFFFFABSE4GTS0jDI4pPYBok55GKfTMMcjGPrT6UbjYUUUVQgpMilooAbkf3jTs0YFFABRRRQB//2Q==",
                            permalink: "https://pointfinance.slack.com/files/U02EG90CQU9/F06N0KY31EE/image.png",
                            permalink_public: "https://slack-files.com/T02ASPNRZ-F06N0KY31EE-70ea46105b",
                            is_starred: false,
                            has_rich_preview: false,
                            file_access: "visible",
                        },
                    ],
                    upload: false,
                    user: "U02EG90CQU9",
                    display_as_bot: false,
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "C/JnE",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "text",
                                            text: "another big number alert:\n\nPDC recently hit ",
                                        },
                                        {
                                            type: "text",
                                            text: "20k organic",
                                            style: {
                                                bold: true,
                                            },
                                        },
                                        {
                                            type: "text",
                                            text: " from the serp in a 28d span for the first time ever!\nNext up is 25k!",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    type: "message",
                    ts: "1709655816.280329",
                    edited: {
                        user: "U02EG90CQU9",
                        ts: "1709655825.000000",
                    },
                    client_msg_id: "9d1a546d-cd94-4d11-b4c2-60c82b2f12a1",
                    reactions: [
                        {
                            name: "raised_hands::skin-tone-2",
                            users: ["U025XKKJGTY", "U04UB4ZBKBQ"],
                            count: 2,
                        },
                        {
                            name: "raised_hands",
                            users: ["U57MPQ8HY", "U02PC6Z1S", "U01HFBY3XGX", "UJ9FGV472", "U7WC7SKRQ"],
                            count: 5,
                        },
                        {
                            name: "rocket",
                            users: ["U04UB4ZBKBQ", "U01HFBY3XGX"],
                            count: 2,
                        },
                    ],
                },
                {
                    text: "Nice to see this over the weekend:",
                    files: [
                        {
                            id: "F06MR5SR3PW",
                            created: 1709488309,
                            timestamp: 1709488309,
                            name: "image.png",
                            title: "image.png",
                            mimetype: "image/png",
                            filetype: "png",
                            pretty_type: "PNG",
                            user: "U02EG90CQU9",
                            user_team: "T02ASPNRZ",
                            editable: false,
                            size: 82637,
                            mode: "hosted",
                            is_external: false,
                            external_type: "",
                            is_public: true,
                            public_url_shared: false,
                            display_as_bot: false,
                            username: "",
                            url_private: "https://files.slack.com/files-pri/T02ASPNRZ-F06MR5SR3PW/image.png",
                            url_private_download: "https://files.slack.com/files-pri/T02ASPNRZ-F06MR5SR3PW/download/image.png",
                            media_display_type: "unknown",
                            thumb_64: "https://files.slack.com/files-tmb/T02ASPNRZ-F06MR5SR3PW-515e77d5ca/image_64.png",
                            thumb_80: "https://files.slack.com/files-tmb/T02ASPNRZ-F06MR5SR3PW-515e77d5ca/image_80.png",
                            thumb_360: "https://files.slack.com/files-tmb/T02ASPNRZ-F06MR5SR3PW-515e77d5ca/image_360.png",
                            thumb_360_w: 335,
                            thumb_360_h: 360,
                            thumb_480: "https://files.slack.com/files-tmb/T02ASPNRZ-F06MR5SR3PW-515e77d5ca/image_480.png",
                            thumb_480_w: 446,
                            thumb_480_h: 480,
                            thumb_160: "https://files.slack.com/files-tmb/T02ASPNRZ-F06MR5SR3PW-515e77d5ca/image_160.png",
                            thumb_720: "https://files.slack.com/files-tmb/T02ASPNRZ-F06MR5SR3PW-515e77d5ca/image_720.png",
                            thumb_720_w: 670,
                            thumb_720_h: 720,
                            original_w: 704,
                            original_h: 757,
                            thumb_tiny: "AwAwACzToopCcdiaADB9TRj3NJnP8LUu7/ZNAC0UUUAFFBOKTI9KAAmlBpmVzSgjsKAHUUmRS0AGM03K+/5U6mkHPGaADK+/5UZX3/KgA+tG0+tACjBpaQAg9aWgD//Z",
                            permalink: "https://pointfinance.slack.com/files/U02EG90CQU9/F06MR5SR3PW/image.png",
                            permalink_public: "https://slack-files.com/T02ASPNRZ-F06MR5SR3PW-8ed77b4156",
                            is_starred: false,
                            has_rich_preview: false,
                            file_access: "visible",
                        },
                    ],
                    upload: false,
                    user: "U02EG90CQU9",
                    display_as_bot: false,
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "NQfwz",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "text",
                                            text: "Nice to see this over the weekend:",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    type: "message",
                    ts: "1709560810.182159",
                    client_msg_id: "6c81dfd9-212f-429c-af48-4883c23937c4",
                    reactions: [
                        {
                            name: "raised_hands::skin-tone-3",
                            users: ["U03BJ5BDABY"],
                            count: 1,
                        },
                        {
                            name: "raised_hands",
                            users: ["U02PC6Z1S", "U03GMNE500N", "U042J4T4B", "U03QPJYFC79", "UJ9FGV472", "U7WC7SKRQ", "U01HFBY3XGX", "U03BBKKN36C", "U57MPQ8HY"],
                            count: 9,
                        },
                        {
                            name: "raised_hands::skin-tone-2",
                            users: ["U04UB4ZBKBQ"],
                            count: 1,
                        },
                    ],
                },
                {
                    user: "U04UB4ZBKBQ",
                    type: "message",
                    ts: "1709335298.429989",
                    edited: {
                        user: "U04UB4ZBKBQ",
                        ts: "1709335325.000000",
                    },
                    client_msg_id: "8deb561d-7ebd-488e-a5d4-f1f60eeed77e",
                    text: ":rocket: A new version of PDC was just deployed including:\n\n*[PNT 356]:* A brand new design for the blog → <https://point.com/blog>\n*[PNT 323]:* Updated filtering and added dynamic search to blog\n*[PNT 354]:* Updated main blog post list filtering logic\n*As well as:*\n• Continued improvements to PDC project structure\n• Small fixes/improvements to global navigation\n• 5 new blog posts :tada::reading:",
                    team: "T02ASPNRZ",
                    attachments: [
                        {
                            image_url: "https://assets-global.website-files.com/62fb9110be019f3cf956c118/6345c5c0979d5e2e06cab1ac_Point--Social-Card-HEI-HELOC-SEED-03.jpg",
                            image_width: 1200,
                            image_height: 630,
                            image_bytes: 200426,
                            from_url: "https://point.com/blog",
                            id: 1,
                            original_url: "https://point.com/blog",
                            fallback: "Blog: Point of View | Learn more from the home equity experts",
                            text: "Point's team of home equity experts shares reports and insights on homeownership, home equity, and personal finance. Start learning here.",
                            title: "Blog: Point of View | Learn more from the home equity experts",
                            title_link: "https://point.com/blog",
                            service_name: "point.com",
                        },
                    ],
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "c+e80",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "emoji",
                                            name: "rocket",
                                            unicode: "1f680",
                                        },
                                        {
                                            type: "text",
                                            text: " A new version of PDC was just deployed including:\n\n",
                                        },
                                        {
                                            type: "text",
                                            text: "[PNT 356]: ",
                                            style: {
                                                bold: true,
                                            },
                                        },
                                        {
                                            type: "text",
                                            text: "A brand new design for the blog → ",
                                        },
                                        {
                                            type: "link",
                                            url: "https://point.com/blog",
                                        },
                                        {
                                            type: "text",
                                            text: "\n",
                                        },
                                        {
                                            type: "text",
                                            text: "[PNT 323]: ",
                                            style: {
                                                bold: true,
                                            },
                                        },
                                        {
                                            type: "text",
                                            text: "Updated filtering and added dynamic search to blog\n",
                                        },
                                        {
                                            type: "text",
                                            text: "[PNT 354]: ",
                                            style: {
                                                bold: true,
                                            },
                                        },
                                        {
                                            type: "text",
                                            text: "Updated main blog post list filtering logic\n",
                                        },
                                        {
                                            type: "text",
                                            text: "As well as:",
                                            style: {
                                                bold: true,
                                            },
                                        },
                                        {
                                            type: "text",
                                            text: "\n",
                                        },
                                    ],
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Continued improvements to PDC project structure",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Small fixes/improvements to global navigation",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "5 new blog posts ",
                                                },
                                                {
                                                    type: "emoji",
                                                    name: "tada",
                                                    unicode: "1f389",
                                                },
                                                {
                                                    type: "emoji",
                                                    name: "reading",
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 0,
                                    border: 0,
                                },
                            ],
                        },
                    ],
                    reactions: [
                        {
                            name: "tada",
                            users: ["UJ9FGV472", "U7WC7SKRQ"],
                            count: 2,
                        },
                        {
                            name: "+1",
                            users: ["U02EG90CQU9"],
                            count: 1,
                        },
                    ],
                },
                {
                    user: "U02EG90CQU9",
                    type: "message",
                    ts: "1708981219.411819",
                    edited: {
                        user: "U02EG90CQU9",
                        ts: "1708981376.000000",
                    },
                    client_msg_id: "85343b81-78db-40f3-bf34-7c5c77d7b096",
                    text: "Note that we are beginning our migration to webflow enterprise today.\n\nAs part of this process we adjusted some records on <http://point.dev|point.dev> to set it up as the new (and now only) staging environment. Everything should be good to go, but if you see anything funny, please let me know.\n\n(TY to <@U03P34Z3Q> who helped on the registrar side with this effort.)",
                    team: "T02ASPNRZ",
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "BC//K",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "text",
                                            text: "Note that we are beginning our migration to webflow enterprise today.\n\nAs part of this process we adjusted some records on ",
                                        },
                                        {
                                            type: "link",
                                            url: "http://point.dev",
                                            text: "point.dev",
                                        },
                                        {
                                            type: "text",
                                            text: " to set it up as the new (and now only) staging environment. Everything should be good to go, but if you see anything funny, please let me know.\n\n(TY to ",
                                        },
                                        {
                                            type: "user",
                                            user_id: "U03P34Z3Q",
                                        },
                                        {
                                            type: "text",
                                            text: " who helped on the registrar side with this effort.)",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    reactions: [
                        {
                            name: "+1",
                            users: ["U01HFBY3XGX"],
                            count: 1,
                        },
                    ],
                },
                {
                    user: "U04UB4ZBKBQ",
                    type: "message",
                    ts: "1708742665.769489",
                    client_msg_id: "7467ef34-7940-406f-b1c8-4684a52d3eb0",
                    text: ":rocket: A new version of PDC was just deployed including:\n\n• *[PNT 389]:* Add route to blog home page from category pages\n• *[PNT 394]:* New content hub oriented category pages\n• *[PNT 347]:* Develop new offer code/DM landing page (<http://point.com/offercode|point.com/offercode>)\n• *[PNT 395]:* Fix broken twitter social share link on blogs\n• *[PNT 396]:* Fix mobile nav icon color issue\n• 4 new blog posts :tada::reading: \n",
                    team: "T02ASPNRZ",
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "QM73o",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "emoji",
                                            name: "rocket",
                                            unicode: "1f680",
                                        },
                                        {
                                            type: "text",
                                            text: " A new version of PDC was just deployed including:\n\n",
                                        },
                                    ],
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 389]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Add route to blog home page from category pages",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 394]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "New content hub oriented category pages",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 347]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Develop new offer code/DM landing page (",
                                                },
                                                {
                                                    type: "link",
                                                    url: "http://point.com/offercode",
                                                    text: "point.com/offercode",
                                                },
                                                {
                                                    type: "text",
                                                    text: ")",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 395]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Fix broken twitter social share link on blogs",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 396]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Fix mobile nav icon color issue",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "4 new blog posts ",
                                                },
                                                {
                                                    type: "emoji",
                                                    name: "tada",
                                                    unicode: "1f389",
                                                },
                                                {
                                                    type: "emoji",
                                                    name: "reading",
                                                },
                                                {
                                                    type: "text",
                                                    text: " ",
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 0,
                                    border: 0,
                                },
                                {
                                    type: "rich_text_section",
                                    elements: [],
                                },
                            ],
                        },
                    ],
                    reactions: [
                        {
                            name: "+1",
                            users: ["U02EG90CQU9"],
                            count: 1,
                        },
                        {
                            name: "raised_hands",
                            users: ["U01HFBY3XGX"],
                            count: 1,
                        },
                    ],
                },
                {
                    user: "U04UB4ZBKBQ",
                    type: "message",
                    ts: "1708128420.013709",
                    edited: {
                        user: "U04UB4ZBKBQ",
                        ts: "1708128805.000000",
                    },
                    client_msg_id: "4347d438-638c-49cc-8051-d7c093c3615f",
                    text: ":rocket: A new version of PDC was just deployed including:\n\n• *[PNT 382]:* Added organization schema to Home, About, Contact pages\n• *[PNT 391]:* Fixed background bleed-through on navigation dropdowns\n• *[PNT 390]:* Added instagram to social rows\n• *[PNT 388]:* Redirect from blog `authors → author` and adjust collection URL\n• *[PNT 380]:* Adjust size difference between H2s and H3s in blog post content rtfs\n• 5 new blog posts :tada: \n• Several additional improvements and cleanup of PDC project tech debt\n• Staged/Pre QA: \n    ◦ Blog updates: <https://point.dev/blog-dev> (PW: blog)",
                    team: "T02ASPNRZ",
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "kJzwA",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "emoji",
                                            name: "rocket",
                                            unicode: "1f680",
                                        },
                                        {
                                            type: "text",
                                            text: " A new version of PDC was just deployed including:\n\n",
                                        },
                                    ],
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 382]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Added organization schema to Home, About, Contact pages",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 391]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Fixed background bleed-through on navigation dropdowns",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 390]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Added instagram to social rows",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 388]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Redirect from blog ",
                                                },
                                                {
                                                    type: "text",
                                                    text: "authors → author",
                                                    style: {
                                                        code: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: " and adjust collection URL",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 380]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Adjust size difference between H2s and H3s in blog post content rtfs",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "5 new blog posts ",
                                                },
                                                {
                                                    type: "emoji",
                                                    name: "tada",
                                                    unicode: "1f389",
                                                },
                                                {
                                                    type: "text",
                                                    text: " ",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Several additional improvements and cleanup of PDC project tech debt",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Staged/Pre QA: ",
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 0,
                                    border: 0,
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Blog updates: ",
                                                },
                                                {
                                                    type: "link",
                                                    url: "https://point.dev/blog-dev",
                                                },
                                                {
                                                    type: "text",
                                                    text: " (PW: blog)",
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 1,
                                    border: 0,
                                },
                            ],
                        },
                    ],
                    reactions: [
                        {
                            name: "+1",
                            users: ["U02EG90CQU9"],
                            count: 1,
                        },
                    ],
                },
                {
                    text: "PDC recently hit *17k organic* from the serp in a 28d span for the first time ever!\nNext up is 20k..",
                    files: [
                        {
                            id: "F06J4HTR83U",
                            created: 1707504223,
                            timestamp: 1707504223,
                            name: "image.png",
                            title: "image.png",
                            mimetype: "image/png",
                            filetype: "png",
                            pretty_type: "PNG",
                            user: "U02EG90CQU9",
                            user_team: "T02ASPNRZ",
                            editable: false,
                            size: 83828,
                            mode: "hosted",
                            is_external: false,
                            external_type: "",
                            is_public: true,
                            public_url_shared: false,
                            display_as_bot: false,
                            username: "",
                            url_private: "https://files.slack.com/files-pri/T02ASPNRZ-F06J4HTR83U/image.png",
                            url_private_download: "https://files.slack.com/files-pri/T02ASPNRZ-F06J4HTR83U/download/image.png",
                            media_display_type: "unknown",
                            thumb_64: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_64.png",
                            thumb_80: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_80.png",
                            thumb_360: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_360.png",
                            thumb_360_w: 298,
                            thumb_360_h: 360,
                            thumb_480: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_480.png",
                            thumb_480_w: 397,
                            thumb_480_h: 480,
                            thumb_160: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_160.png",
                            thumb_720: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_720.png",
                            thumb_720_w: 595,
                            thumb_720_h: 720,
                            thumb_800: "https://files.slack.com/files-tmb/T02ASPNRZ-F06J4HTR83U-0ea9b118f8/image_800.png",
                            thumb_800_w: 661,
                            thumb_800_h: 800,
                            original_w: 735,
                            original_h: 889,
                            thumb_tiny: "AwAwACfToopDnsaADcD3paTn1H5Uo96ACiiigApGJA460tIRkc0nsBH84JOc4qUUzbnq3FPpRVhsKKKKoQUmfalooAbx/dpcn0paKACiiigD/9k=",
                            permalink: "https://pointfinance.slack.com/files/U02EG90CQU9/F06J4HTR83U/image.png",
                            permalink_public: "https://slack-files.com/T02ASPNRZ-F06J4HTR83U-d55dc28c64",
                            is_starred: false,
                            has_rich_preview: false,
                            file_access: "visible",
                        },
                    ],
                    upload: false,
                    user: "U02EG90CQU9",
                    display_as_bot: false,
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "5AHrY",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "text",
                                            text: "PDC recently hit ",
                                        },
                                        {
                                            type: "text",
                                            text: "17k organic",
                                            style: {
                                                bold: true,
                                            },
                                        },
                                        {
                                            type: "text",
                                            text: " from the serp in a 28d span for the first time ever!\nNext up is 20k..",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    type: "message",
                    ts: "1707504328.670149",
                    edited: {
                        user: "U02EG90CQU9",
                        ts: "1707504341.000000",
                    },
                    client_msg_id: "003f9fa4-9e49-4155-8e3d-5786e7046af6",
                    thread_ts: "1707504328.670149",
                    reply_count: 1,
                    reply_users_count: 1,
                    latest_reply: "1707505937.750169",
                    reply_users: ["U025XKKJGTY"],
                    is_locked: false,
                    subscribed: false,
                    reactions: [
                        {
                            name: "tada",
                            users: ["U03BJ5BDABY", "U04UB4ZBKBQ", "U03BBKKN36C", "U042J4T4B", "U025XKKJGTY", "UPCP0F2RW", "U03MMKV7RBN", "U03C1DUSQQ7", "U02PC6Z1S", "U02D3CUNZBM", "UDEGWBLAE"],
                            count: 11,
                        },
                    ],
                },
                {
                    user: "U04UB4ZBKBQ",
                    type: "message",
                    ts: "1706914451.684939",
                    client_msg_id: "43e7341f-d1ae-4a89-a340-3383da05a53a",
                    text: ":rocket: A new version of PDC was just deployed including:\n• *[PNT 343]:* Standardized social proof section padding on product pages\n• *[PNT 343]:* Refactor product page hero components to remove mobile only component\n• Continuing work towards clean up of tech debt/code messes for *PNT-365*\n    ◦ margin and padding standardization\n• Updated leadership bios to latest versions\n• Five new blog posts :tada:",
                    team: "T02ASPNRZ",
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "59pN5",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "emoji",
                                            name: "rocket",
                                            unicode: "1f680",
                                        },
                                        {
                                            type: "text",
                                            text: " A new version of PDC was just deployed including:\n",
                                        },
                                    ],
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 343]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Standardized social proof section padding on product pages",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "[PNT 343]: ",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: "text",
                                                    text: "Refactor product page hero components to remove mobile only component",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Continuing work towards clean up of tech debt/code messes for ",
                                                },
                                                {
                                                    type: "text",
                                                    text: "PNT-365",
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 0,
                                    border: 0,
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "margin and padding standardization",
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 1,
                                    border: 0,
                                },
                                {
                                    type: "rich_text_list",
                                    elements: [
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Updated leadership bios to latest versions",
                                                },
                                            ],
                                        },
                                        {
                                            type: "rich_text_section",
                                            elements: [
                                                {
                                                    type: "text",
                                                    text: "Five new blog posts ",
                                                },
                                                {
                                                    type: "emoji",
                                                    name: "tada",
                                                    unicode: "1f389",
                                                },
                                            ],
                                        },
                                    ],
                                    style: "bullet",
                                    indent: 0,
                                    border: 0,
                                },
                            ],
                        },
                    ],
                    reactions: [
                        {
                            name: "+1",
                            users: ["U02EG90CQU9"],
                            count: 1,
                        },
                    ],
                },
                {
                    user: "U03QRH0FZHQ",
                    type: "message",
                    ts: "1706771813.469219",
                    client_msg_id: "e1904bd4-52ff-4fe6-aa67-c182a9d89a44",
                    text: "Initial run passed in circleCI\n<https://app.circleci.com/pipelines/github/pointdotcom/qa-automation/4728/workflows/56dd930f-a1a4-44d3-8059-56e4918428a3/jobs/19723>",
                    team: "T02ASPNRZ",
                    blocks: [
                        {
                            type: "rich_text",
                            block_id: "onNUG",
                            elements: [
                                {
                                    type: "rich_text_section",
                                    elements: [
                                        {
                                            type: "text",
                                            text: "Initial run passed in circleCI\n",
                                        },
                                        {
                                            type: "link",
                                            url: "https://app.circleci.com/pipelines/github/pointdotcom/qa-automation/4728/workflows/56dd930f-a1a4-44d3-8059-56e4918428a3/jobs/19723",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            has_more: true,
            pin_count: 0,
            channel_actions_ts: null,
            channel_actions_count: 0,
            response_metadata: {
                next_cursor: "bmV4dF90czoxNzA2NzcxNTk5MzkyOTM5",
            },
        },
    ],
};
// Usage example with your provided originalData
var filteredMessages = filterMessages(originalData);
console.log(filteredMessages);
