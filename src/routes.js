import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ipfcaxuoxeqpztfblabv.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const router = Router();

router.get("/api/airports", async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const page = req.query.page || 1;

        const pageNumber = page ? parseInt(page) : 1;
        const firstIndex = (pageNumber - 1) * 50;
        const lastIndex = pageNumber * 50 - 1;

        let { data: airportsByName, error } = await supabase
            .from("airports")
            .select("*")
            .or(`name.ilike.*${keyword}*,municipality.ilike.*${keyword}*`) // Search by name or municipality
            .neq("type", "heliport")
            .neq("iata_code", null)
            .order("iso_country", { ascending: true })
            .range(firstIndex, lastIndex);
            
        if (error) throw error;

        if (airportsByName === null || airportsByName.length == 0) {
            console.log("No airports found for the search term:", keyword);
            return res.json({
                status: "success",
                length: 0,
                pagination: {
                    current: pageNumber,
                    total: 0,
                    next: null,
                    prev: null,
                },
                data: ["No airports found for the search term"],
            });
        }

        // Fetch the total number of airports
        const { count } = await supabase
            .from("airports")
            .select("*", { count: "exact", head: true })
            .or(`name.ilike.*${keyword}*,municipality.ilike.*${keyword}*`) // Search by name or municipality
            .neq("type", "heliport")
            .neq("type", "closed")
            .neq("iata_code", null)
            .order("iso_country", { ascending: true });

        console.log("Total airports:", count);

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / 50);

        const resObj = {
            status: "success",
            length: count,
            pagination: {
                current: pageNumber,
                total: totalPages,
                next: totalPages > pageNumber ? pageNumber + 1 : null,
                prev: pageNumber > 1 ? pageNumber - 1 : null,
            },
            data: airportsByName,
        };


        res.json(resObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});


router.get("/api/regions", async (req, res) => {
    try {
        const region = req.query.region;

        let { data: region_data, error } = await supabase
            .from("regions")
            .select()
            .eq("code", region)
            
        if (error) throw error;

        res.json(region_data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

export default router;
