// MVC MODEL ADAPTER FOR BACKWARDS COMPATIBILITY & SAAS SYSTEM
import { NewsModel } from './js/models/NewsModel.js?v=70.0';
import { ProjectModel } from './js/models/ProjectModel.js?v=70.0';
import { PublicationModel } from './js/models/PublicationModel.js?v=70.0';
import { EventModel } from './js/models/EventModel.js?v=70.0';
import { BrandingModel } from './js/models/BrandingModel.js?v=70.0';
import { VideoModel } from './js/models/VideoModel.js?v=70.0';
import { ComplaintModel } from './js/models/ComplaintModel.js?v=70.0';
import { ServiceModel } from './js/models/ServiceModel.js?v=70.0';
import { MandateModel } from './js/models/MandateModel.js?v=70.0';
import { SynthesisReportModel } from './js/models/SynthesisReportModel.js?v=70.0';
import { SubventionModel } from './js/models/SubventionModel.js?v=70.0';
import { PollModel } from './js/models/PollModel.js?v=70.0';

// Init models
NewsModel.init();
ProjectModel.init();
PublicationModel.init();
EventModel.init();
BrandingModel.init();
VideoModel.init();
ComplaintModel.init();
ServiceModel.init();
MandateModel.init();
SynthesisReportModel.init();
SubventionModel.init();
PollModel.init();

export const db = {
    getNews: () => NewsModel.getAll(),
    saveNews: (data) => NewsModel.saveAll(data),
    getProjects: () => ProjectModel.getAll(),
    saveProjects: (data) => ProjectModel.saveAll(data),
    getPublications: () => PublicationModel.getAll(),
    savePublications: (data) => PublicationModel.saveAll(data),
    getEvents: () => EventModel.getAll(),
    saveEvents: (data) => EventModel.saveAll(data),
    getBranding: () => BrandingModel.get(),
    saveBranding: (data) => BrandingModel.save(data),
    getVideos: () => VideoModel.getAll(),
    saveVideos: (data) => VideoModel.saveAll(data),
    getComplaints: () => ComplaintModel.getAll(),
    saveComplaints: (data) => ComplaintModel.saveAll(data),
    addComplaint: (data) => ComplaintModel.add(data),
    getServices: () => ServiceModel.getAll(),
    saveServices: (data) => ServiceModel.saveAll(data),
    getMandate: () => MandateModel.get(),
    saveMandate: (data) => MandateModel.save(data),
    getSynthesisReport: () => SynthesisReportModel.get(),
    saveSynthesisReport: (data) => SynthesisReportModel.save(data),
    getSubventions: () => SubventionModel.get(),
    saveSubventions: (data) => SubventionModel.save(data),
    getPolls: () => PollModel.getAll(),
    getActivePoll: () => PollModel.getActivePoll(),
    exportPackage: () => BrandingModel.exportPackageJSON(),
    importPackage: (jsonStr) => BrandingModel.importPackageJSON(jsonStr)
};

window.agadirDB = db;
