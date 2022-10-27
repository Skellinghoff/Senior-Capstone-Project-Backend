import MarkersDAO from '../dao/markersDAO.js';

export default class MarkersController {
    static async apiGetMarkers(req, res, next) {
        const markersPerPage = req.query.markersPerPage
            ? parseInt(req.query.markersPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.category) {
            filters._category = req.query.category;
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        } else if (req.query.name) {
            filters._name = req.query.name;
        }

        const { markersList, totalNumMarkers } =
            await MarkersDAO.getMarkers({
                filters,
                page,
                markersPerPage,
            });

        let response = {
            markers: markersList,
            page: page,
            filters: filters,
            entries_per_page: markersPerPage,
            total_results: totalNumMarkers,
        };
        res.json(response);
    }
    static async apiGetMarkerById(req, res, next) {
        try {
            let id = req.params.id || {};
            let marker = await MarkersDAO.getMarkerByID(id);
            if (!marker) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(marker);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetMarkerCuisines(req, res, next) {
        try {
            let cuisines = await MarkersDAO.getCuisines();
            res.json(cuisines);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}
