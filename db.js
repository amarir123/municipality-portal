// MVC MODEL ADAPTER FOR BACKWARDS COMPATIBILITY & SAAS SYSTEM
import { NewsModel } from './js/models/NewsModel.js';
import { ProjectModel } from './js/models/ProjectModel.js';
import { PublicationModel } from './js/models/PublicationModel.js';
import { EventModel } from './js/models/EventModel.js';
import { BrandingModel } from './js/models/BrandingModel.js';
import { VideoModel } from './js/models/VideoModel.js';
import { ComplaintModel } from './js/models/ComplaintModel.js';
import { ServiceModel } from './js/models/ServiceModel.js';

// Init models
NewsModel.init();
ProjectModel.init();
PublicationModel.init();
EventModel.init();
BrandingModel.init();
VideoModel.init();
ComplaintModel.init();
ServiceModel.init();

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
    exportPackage: () => BrandingModel.exportPackageJSON(),
    importPackage: (jsonStr) => BrandingModel.importPackageJSON(jsonStr)
};

window.agadirDB = db;
