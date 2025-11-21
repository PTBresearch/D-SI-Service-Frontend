/*
 * Copyright (c) 2022-2023  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
 * This source code and software is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 * The software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this Code.  If not, see http://www.gnu.org/licenses.
 * CONTACT: 		info@ptb.de
 * DEVELOPMENT:		https://d-si.ptb.de
 * AUTHORS:		Wafa El Jaoua, Tobias Hoffmann, Clifford Brown, Daniel Hutzschenreuter
 * LAST MODIFIED:		 28.09.23, 10:20
 */
package de.ptb.codataapi.controller;

import de.ptb.codataapi.model.*;

import de.ptb.codataapi.service.ContributionsService;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.*;


@OpenAPIDefinition(
        info = @Info(
                title = "Client Service Backend API",
                description = "This API exposes endpoints to manage Client-Backend.",
                version = "1.0.0",
                contact = @Contact(
                        name = "D-SI Services_Client",
                        url = "https://d-si.ptb.de/#/d-comparison",
                        email = "Daniel.Hutzschenreuter@ptb.de")),
        servers = {
                @Server(url = "https://d-si.ptb.de", description = "Server URL in production environment"),
                @Server(url ="http://localhost:8084", description = "Server URL in development environment")

        })
@Tag(name = "Client-Api", description = "D-Si_Service Client API")
@RestController
@RequestMapping(path = "/api/client")

public class ClientController {
    @Autowired
    private final ContributionsService contributionsService;

    public ClientController(ContributionsService contributionsService) {
        this.contributionsService = contributionsService;
    }


    /**
     * <p>method retrieves a List of contributions through an HTTP GET request.</p>
     * @return ResponseEntity, which return a List of contributions in JSON format as a response Entity with an HTTP status of 200 (OK).
     */
//    @RequestMapping(value = "/contributions", method = RequestMethod.GET)
//    public ResponseEntity<List<Contribution>> getContributions(String sessionId) {
//        return new ResponseEntity<>(contributionsService.getContributionList(sessionId), HttpStatus.OK);
//    }
    @GetMapping("/contributions")
    public ResponseEntity<List<Contribution>> getContributions(@RequestParam("sessionId") String sessionId) {
        List<Contribution> contributions = contributionsService.getContributionList(sessionId);
        return new ResponseEntity<>(contributions, HttpStatus.OK);
    }

    /**
     * <p>method creates a new participant through an HTTP POST request.</p>
     * @return ResponseEntity, which return a new contribution as a response Entity with an HTTP status of 201 (CREATED).
     */

//
    @PostMapping("/addContribution")
    public ResponseEntity<Contribution> addContribution(@RequestParam("sessionId") String sessionId, @RequestBody Contribution contribution) {
        Contribution addedContribution = contributionsService.addContribution(sessionId, contribution);

        return new ResponseEntity<>(addedContribution, HttpStatus.CREATED);
    }

    /**
     * <p>method deletes a  specific contribution through an HTTP DELETE request.</p>
     * @return ResponseEntity, which return  a response Entity with an HTTP status of 200(OK).
     */
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Long> delete(@PathVariable("id") Long id, @RequestHeader("sessionId") String sessionId) {
        contributionsService.delete(sessionId, Math.toIntExact(id));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <p>method deletes all contributions through an HTTP DELETE request.</p>
     * @return ResponseEntity, which return a response Entity with an HTTP status of 200 (OK).
     */
    // Delete all contributions
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Long> deleteAll(@RequestHeader("sessionId") String sessionId) {
        contributionsService.deleteAll(sessionId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <p>method retrieves a report through an HTTP GET request.</p>
     * @return ResponseEntity, which return a report with the PidReport and the List of contributions in JSON format as a response Entity with an HTTP status of 200 (OK).
     */
    @RequestMapping(value = "/report", method = RequestMethod.GET)
    public ResponseEntity<Report> getReport(@RequestHeader("sessionId") String sessionId) {
        Report report = contributionsService.getReport(sessionId);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    /**
     * <p>method creates a new report through an HTTP POST request.</p>
     * @return ResponseEntity, which return a report as a response Entity with an HTTP status of 201 (CREATED).
     */
    @RequestMapping(value = "/addReport", method = RequestMethod.POST)
    public ResponseEntity<Report> addReport(@RequestBody Report report, @RequestHeader("sessionId") String sessionId) {
        Report addedReport = contributionsService.addReport(sessionId, report);
        return new ResponseEntity<>(addedReport, HttpStatus.CREATED);
    }

    /**
     * <p>method to download the XML report through an HTTP GET request from the DKCR_Backend API with POST request,
     * which has as  response the filename and Base64String.</p>
     * @author Wafa El jaoua
     */

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void downloadReportXML(HttpServletResponse response, @RequestHeader("sessionId") String sessionId) throws IOException {
            contributionsService.downloadAndSaveReport(sessionId,response);
        }


}

