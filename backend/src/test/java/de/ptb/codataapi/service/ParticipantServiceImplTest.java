/*
 * Copyright (c) 2022-2024  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
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
 * LAST MODIFIED:		 14.01.24, 16:02
 */

package de.ptb.codataapi.service;

import de.ptb.codataapi.model.Participant;
import de.ptb.codataapi.model.Report;
import de.ptb.codataapi.repository.ParticipantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ParticipantServiceImplTest {
    @InjectMocks
    private ParticipantServiceImpl service;
    @Mock
    private ParticipantRepository repository;

    private List<Participant> participantList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Participant participant1 = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
        Participant participant2 = new Participant(2L, "PTB", "CCM.M-K1-PTB9608");
        participantList = List.of(participant1, participant2);

    }

    @Test
    void should_return_participantList() {
        //Mock the call
        when(repository.getAllParticipants()).thenReturn(participantList);
        //when
        List<Participant> exceptedList= service.getParticipantList();
        //then
        assertEquals(participantList, exceptedList);

    }

    @Test
    void should_return_participant_isRemoved() {
        //when
        when(repository.delete(any())).thenReturn(true);
        //then
        boolean isParticipantRemoved = service.delete(1L);
        //verify
        assertTrue(isParticipantRemoved);
    }

    @Test
    void should_return_addedParticipant() {
        //given
        Participant participant = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
        //when
        when(repository.addParticipant(participant)).thenReturn(participant);
        //then
        Participant participantExpected = service.addParticipant(participant);
        assertNotNull(participantExpected);
        assertEquals(participant, participantExpected);
    }

//    @Test
//    void addReport() {
//        //given
//        Participant participant1 = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
//        Participant participant2 = new Participant(2L, "PTB", "CCM.M-K1-PTB9608");
//        participantList = List.of(participant1, participant2);
//        Report report = new Report("CCM-KC1", participantList);
//        //when
//        when(repository.addReport(report)).thenReturn(report);
//        //then
//        Report reportExpected = repository.addReport(report);
//        assertNotNull(reportExpected);
//        assertEquals(report, reportExpected);
//    }
}