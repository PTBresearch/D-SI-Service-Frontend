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
import de.ptb.codataapi.service.ParticipantService;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
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
@AllArgsConstructor
@RestController
@RequestMapping(path = "/api/client")
public class ClientController {

    private final ParticipantService participantService;
    private static final String VALID_DCC = "PTB-DCC-4711";

    /**
     * <p>method retrieves a List of participants through an HTTP GET request.</p>
     * @return ResponseEntity, which return a List of participants in JSON format as a response Entity with an HTTP status of 200 (OK).
     */
    @RequestMapping(value = "/participants", method = RequestMethod.GET)
    public ResponseEntity<List<Participant>> getParticipants() {
        return new ResponseEntity<>(participantService.getParticipantList(), HttpStatus.OK);
    }

    /**
     * <p>method creates a new participant through an HTTP POST request.</p>
     * @return ResponseEntity, which return a new participant as a response Entity with an HTTP status of 201 (CREATED).
     */

    @RequestMapping(value = "/addParticipant", method = RequestMethod.POST)
    public ResponseEntity<Participant> addParticipant(@RequestBody Participant participant) {
        return new ResponseEntity<>(participantService.addParticipant(participant), HttpStatus.CREATED);
    }

    /**
     * <p>method deletes a  specific participant through an HTTP DELETE request.</p>
     * @return ResponseEntity, which return  a response Entity with an HTTP status of 200(OK).
     */
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Long> delete(@PathVariable("id") Long id) {
        participantService.delete(Math.toIntExact(id));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <p>method deletes all participants through an HTTP DELETE request.</p>
     * @return ResponseEntity, which return a response Entity with an HTTP status of 200 (OK).
     */
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Long> deleteAll() {
        participantService.deleteAll();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <p>method retrieves a report through an HTTP GET request.</p>
     * @return ResponseEntity, which return a report with the PidReport and the List of participants in JSON format as a response Entity with an HTTP status of 200 (OK).
     */
    @RequestMapping(value = "/report", method = RequestMethod.GET)
    public ResponseEntity<Report> getReport() {
        Report r = new Report();
        r.setPidReport(participantService.getReport().getPidReport());
        r.setSmartStandardEvaluationMethod(participantService.getReport().getSmartStandardEvaluationMethod());
        r.setParticipantList(participantService.getParticipantList());
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    /**
     * <p>method creates a new report through an HTTP POST request.</p>
     * @return ResponseEntity, which return a report as a response Entity with an HTTP status of 201 (CREATED).
     */
    @RequestMapping(value = "/addReport", method = RequestMethod.POST)
    public ResponseEntity<Report> addReport(@RequestBody Report report) {
        return new ResponseEntity<>(participantService.addReport(report), HttpStatus.CREATED);
    }

    /**
     * <p>method to download the XML report through an HTTP GET request from the DKCR_Backend API with POST request,
     * which has as  response the filename and Base64String.</p>
     * @author Wafa El jaoua
     */

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void downloadReportXML(HttpServletResponse response) throws IOException {
            participantService.downloadAndSaveReport(response);
        }

}

