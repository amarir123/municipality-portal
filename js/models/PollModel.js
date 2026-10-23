// POLL MODEL: سبر الآراء واستطلاعات الرأي والمشاعر للمواطنين
const POLL_STORAGE_KEY = 'agadir_polls_data';
const USER_VOTES_KEY = 'agadir_citizen_voted_polls';

export const PollModel = {
    init() {
        const stored = localStorage.getItem(POLL_STORAGE_KEY);
        const defaultData = [
            {
                id: 1,
                question: "ما رأيك في جودة الخدمات الرقمية والإدارية المقدمة بجماعة بيوكرى؟",
                type: "sentiment",
                category: "استطلاع رأي المواطنين",
                createdAt: "2026-10-15",
                isActive: true,
                sentimentOptions: [
                    { key: "very_good", emoji: "🌟", label: "ممتاز جداً", votes: 218 },
                    { key: "good", emoji: "👍", label: "جيد", votes: 94 },
                    { key: "average", emoji: "😐", label: "متوسط", votes: 22 },
                    { key: "needs_improvement", emoji: "⚠️", label: "يحتاج تحسين", votes: 14 },
                    { key: "dissatisfied", emoji: "👎", label: "غير راضٍ", votes: 6 }
                ],
                totalVotes: 354
            },
            {
                id: 2,
                question: "هل تؤيدون إحداث مسار مخصص لحافلات النقل الحضري الذكي والدرجات الهوائية بوسط المدينة؟",
                type: "standard",
                category: "التنقل الحضري",
                createdAt: "2026-10-10",
                isActive: false,
                options: [
                    { key: "yes", label: "نعم، أؤيد بشدة", votes: 312 },
                    { key: "no", label: "لا، أفضل توسعة مسارات السيارات", votes: 68 },
                    { key: "neutral", label: "بدون رأي", votes: 24 }
                ],
                totalVotes: 404
            }
        ];

        if (!stored) {
            this.save(defaultData);
        } else {
            try {
                const list = JSON.parse(stored);
                // If old schema without 5 options, refresh
                if (list[0] && (!list[0].sentimentOptions || list[0].sentimentOptions.length !== 5)) {
                    this.save(defaultData);
                }
            } catch (e) {
                this.save(defaultData);
            }
        }
    },

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(POLL_STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    },

    getActivePoll() {
        const polls = this.getAll();
        return polls.find(p => p.isActive) || polls[0] || null;
    },

    save(data) {
        localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(data));
        return data;
    },

    hasUserVoted(pollId) {
        try {
            const voted = JSON.parse(localStorage.getItem(USER_VOTES_KEY)) || [];
            return voted.includes(pollId);
        } catch (e) {
            return false;
        }
    },

    markUserVoted(pollId) {
        try {
            const voted = JSON.parse(localStorage.getItem(USER_VOTES_KEY)) || [];
            if (!voted.includes(pollId)) {
                voted.push(pollId);
                localStorage.setItem(USER_VOTES_KEY, JSON.stringify(voted));
            }
        } catch (e) {}
    },

    voteSentiment(pollId, optionKey) {
        const polls = this.getAll();
        const poll = polls.find(p => p.id === pollId);
        if (!poll) return false;

        const opt = poll.sentimentOptions.find(o => o.key === optionKey);
        if (opt) {
            opt.votes += 1;
            poll.totalVotes += 1;
            this.save(polls);
            this.markUserVoted(pollId);
            return poll;
        }
        return false;
    },

    voteStandard(pollId, optionKey) {
        const polls = this.getAll();
        const poll = polls.find(p => p.id === pollId);
        if (!poll) return false;

        const opt = poll.options.find(o => o.key === optionKey);
        if (opt) {
            opt.votes += 1;
            poll.totalVotes += 1;
            this.save(polls);
            this.markUserVoted(pollId);
            return poll;
        }
        return false;
    },

    createPoll(pollData) {
        const polls = this.getAll();
        // If the new one is active, make others inactive
        if (pollData.isActive) {
            polls.forEach(p => p.isActive = false);
        }
        pollData.id = Date.now();
        pollData.createdAt = new Date().toISOString().split('T')[0];
        pollData.totalVotes = 0;

        if (pollData.type === 'sentiment') {
            pollData.sentimentOptions = [
                { key: "love", emoji: "😍", label: "ممتازة جداً", votes: 0 },
                { key: "happy", emoji: "🙂", label: "مرضية وجيدة", votes: 0 },
                { key: "neutral", emoji: "😐", label: "متوسطة", votes: 0 },
                { key: "sad", emoji: "🙁", label: "دون التطلعات", votes: 0 },
                { key: "angry", emoji: "😡", label: "غير راضٍ تماماً", votes: 0 }
            ];
        }

        polls.unshift(pollData);
        this.save(polls);
        return pollData;
    },

    deletePoll(id) {
        let polls = this.getAll();
        polls = polls.filter(p => p.id !== id);
        this.save(polls);
        return polls;
    },

    setActive(id) {
        const polls = this.getAll();
        polls.forEach(p => {
            p.isActive = (p.id === id);
        });
        this.save(polls);
        return polls;
    }
};
