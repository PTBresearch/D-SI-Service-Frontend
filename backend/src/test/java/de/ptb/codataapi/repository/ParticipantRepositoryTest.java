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
 * LAST MODIFIED:		 12.01.24, 14:50
 */

package de.ptb.codataapi.repository;

import de.ptb.codataapi.model.Participant;
import de.ptb.codataapi.model.Report;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ParticipantRepositoryTest {

    @InjectMocks
    private ParticipantRepository repository;
    @Mock
    private List<Participant> participantList;

    private Report report;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void should_return_participantList() {
        when(participantList.size()).thenReturn(1);
        List<Participant> resultParticipantList = repository.getAllParticipants();
        assertNotNull(resultParticipantList);
        assertEquals(1, resultParticipantList.size());
    }

    @Test
    void should_return_participant_isRemoved() {
        //when
        when(participantList.removeIf(any())).thenReturn(true);
        //then
        boolean isParticipantRemoved = repository.delete(1L);
        //verify
        assertTrue(isParticipantRemoved);
        verify(participantList, times(1)).removeIf(any());
    }

    @Test
    void should_return_participant_isNotRemoved() {
        //when
        when(participantList.removeIf(any())).thenReturn(false);
        //then
        boolean isParticipantRemoved = repository.delete(6L);
        //verify
        assertFalse(isParticipantRemoved);
        verify(participantList, times(1)).removeIf(any());

    }

    @Test
    void should_return_addedParticipant() {
        //when
        Participant participant = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
        when(participantList.add(participant)).thenReturn(true);
        //then
        Participant participantExpected = repository.addParticipant(participant);
        //verify
        assertNotNull(participantExpected);
        assertEquals(participant, participantExpected);
    }

//    @Test
//    void should_return_addedReport() {
//        //given
//        Participant participant1 = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
//        Participant participant2 = new Participant(2L, "PTB", "CCM.M-K1-PTB9608");
//        List<Participant> participantList = List.of(participant1, participant2);
//        report = new Report("CCM-KC1", participantList);
//        //when
//        Report reportExpected = repository.addReport(report);
//        //then
//        assertNotNull(reportExpected);
//        assertEquals(report, reportExpected);
//    }

}