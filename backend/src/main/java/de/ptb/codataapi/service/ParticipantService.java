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
 * LAST MODIFIED:		 05.10.23, 10:36
 */

package de.ptb.codataapi.service;

import de.ptb.codataapi.model.Participant;
import de.ptb.codataapi.model.Report;
import java.util.List;
/**
 * This is an interface for participant service .
 * @author Wafa El jaoua
 */
public interface ParticipantService {
    List<Participant> getParticipantList();
    boolean delete(long id);
    void deleteAll();
    Participant addParticipant(Participant participant);
    Participant update(Participant p);
    Report addReport(Report report);
    Report getReport();
}
