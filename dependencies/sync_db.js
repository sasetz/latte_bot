module.exports = async (team, database, network) => {
    const Team = database.model('team');
    const Title = database.model('title');
    const Chapter = database.model('chapter');

    // 1. fetch all titles of the team

    let hasNextPage = true;
    let nextPage = 1;
    let promises = [];

    while (hasNextPage) {
        const response = await network.get('/manga', {
            params: {
                target_id: team.mangalibId,
                target_model: 'team',
                site_id: [ 1, 2, 3, 4, 5 ],
                page: nextPage,
            },
        });

        nextPage++;
        hasNextPage = response.data.meta.has_next_page;
        const titles = response.data.data;

        promises = promises.concat(
            titles.map(async title => {
                const storedTitle = await Title.findOne({ where: { mangalibId: title.id } });

                const titlePayload = {
                    mangalibId: title.id,
                    titleJp: title.name,
                    titleEn: title.eng_name,
                    titleRu: title.rus_name,
                    siteId: title.site,
                    teamId: team.id,
                };

                if (storedTitle == null) {
                    await Title.create(titlePayload);
                } else {
                    await storedTitle.update(titlePayload);
                }
            })
        );
    }
    await Promise.all(promises);

    // 2. fetch all the chapters of the team

    hasNextPage = true;
    nextPage = 1;
    promises = [];

    while (hasNextPage) {
        const response = await network.get(`/teams/${team.mangalibId}/chapters`, {
            params: {
                page: nextPage,
            },
        });

        nextPage++;
        hasNextPage = response.data.meta.has_next_page;
        const chapters = response.data.data.map(element => element.chapter);

        promises = promises.concat(
            chapters.map(async chapter => {
                const storedChapter = await Chapter.findOne({ where: { mangalibId: chapter.id } });
                const storedTitle = await Title.findOne({ where: { mangalibId: chapter.manga_id } });

                const chapterPayload = {
                    name: chapter.name,
                    mangalibId: chapter.id,
                    volume: chapter.volume,
                    number: chapter.number,
                    publishedAt: chapter.created_at,
                    titleId: storedTitle.id,
                };

                if (storedChapter == null) {
                    await Chapter.create(chapterPayload);
                } else {
                    await storedChapter.update(chapterPayload);
                }
            })
        );
    }
    await Promise.all(promises);
}
